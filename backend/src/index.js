/**
 * Cloudflare Workers용 수원 힐링 상담센터 API
 */

import { 
  createErrorResponse, 
  createSuccessResponse, 
  logError,
  validateId,
  validateRequired,
  validateEmail,
  validatePhone,
  handleDatabaseError,
  NotFoundError,
  ValidationError,
  DatabaseError,
  HTTP_STATUS
} from './errors.js';

import { 
  initLogger, 
  getLogger, 
  logRequest, 
  logDatabase,
  createRequestLogger,
  measurePerformance
} from './logger.js';

import { 
  initCache, 
  getCache,
  generateCacheKey,
  CACHE_TTL,
  cacheCounselors,
  getCachedCounselors,
  cacheNotices,
  getCachedNotices,
  cacheReviews,
  getCachedReviews,
  getCacheStatus
} from './cache.js';

import { 
  initDatabase, 
  getDatabase 
} from './database.js';

import { 
  initMemoryMonitor, 
  getMemoryMonitor,
  getMemoryStatus,
  optimizeMemory
} from './memory.js';

export default {
  async fetch(request, env, ctx) {
    // 로거 초기화
    const logger = initLogger(env);
    
    // 캐시 초기화
    const cache = initCache(env.CACHE);
    
    // 데이터베이스 초기화
    const db = initDatabase(env);
    
    // 메모리 모니터 초기화
    const memoryMonitor = initMemoryMonitor();
    
    const startTime = Date.now();
    
    // CORS 헤더 설정
    const corsHeaders = {
      'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, POST, PUT, PATCH, DELETE, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization, Cache-Control, Pragma, Expires',
    };

    // 성능 최적화 헤더
    const performanceHeaders = {
      'X-Content-Type-Options': 'nosniff',
      'X-Frame-Options': 'DENY',
      'X-XSS-Protection': '1; mode=block',
      'Cache-Control': 'public, max-age=300', // 5분 캐싱
      'Vary': 'Accept-Encoding'
    };

    // OPTIONS 요청 처리 (CORS preflight)
    if (request.method === 'OPTIONS') {
      logger.debug('CORS Preflight Request', { method: request.method });
      return new Response(null, {
        status: 200,
        headers: { ...corsHeaders, ...performanceHeaders },
      });
    }

    const url = new URL(request.url);
    const path = url.pathname;
    const method = request.method;
    
    logger.info('Request Started', {
      method,
      path,
      userAgent: request.headers.get('User-Agent'),
      ip: request.headers.get('CF-Connecting-IP') || 'unknown'
    });

    let response;
    
    try {
      // API 라우팅
      if (path === '/api/health') {
        response = handleHealth(request, corsHeaders);
      } else if (path === '/api/counselors') {
        if (request.method === 'GET') {
        response = await handleCounselors(request, env, corsHeaders);
        } else if (request.method === 'POST') {
          response = await handleCreateCounselor(request, env, corsHeaders);
        }
      } else if (path.startsWith('/api/counselors/')) {
          const pathParts = path.split('/');
          const id = pathParts[3];
          const action = pathParts[4];
          
          if (action === 'toggle-status') {
            response = await handleToggleCounselorStatus(request, env, corsHeaders, id);
          } else if (request.method === 'DELETE') {
            response = await handleDeleteCounselor(request, env, corsHeaders, id);
          } else if (request.method === 'PUT') {
            response = await handleUpdateCounselor(request, env, corsHeaders, id);
          } else {
        response = await handleCounselorById(request, env, corsHeaders, id);
          }
      } else if (path === '/api/notices') {
        response = await handleNotices(request, env, corsHeaders);
      } else if (path.startsWith('/api/notices/')) {
        const id = path.split('/')[3];
        response = await handleNoticeById(request, env, corsHeaders, id);
      } else if (path === '/api/reviews') {
        response = await handleReviews(request, env, corsHeaders);
      } else if (path.startsWith('/api/reviews/')) {
        const id = path.split('/')[3];
        response = await handleReviewById(request, env, corsHeaders, id);
      } else if (path === '/api/consultations') {
        response = await handleConsultations(request, env, corsHeaders);
      } else if (path.startsWith('/api/consultations/')) {
        const id = path.split('/')[3];
        if (request.method === 'PATCH') {
          response = await handleUpdateConsultationStatus(request, env, corsHeaders, id);
        } else {
          response = await handleConsultationById(request, env, corsHeaders, id);
        }
      } else if (path === '/openapi.json') {
        response = handleOpenAPI(request, corsHeaders);
      } else if (path === '/docs' || path === '/api-docs') {
        response = handleAPIDocs(request, corsHeaders);
      } else if (path === '/api/metrics') {
        response = handleMetrics(request, corsHeaders);
      } else if (path === '/api/cache/status') {
        response = handleCacheStatus(request, corsHeaders);
      } else if (path === '/api/cache/clear') {
        response = await handleCacheClear(request, corsHeaders);
      } else if (path === '/api/dashboard') {
        response = await handleDashboard(request, corsHeaders);
      } else if (path === '/api/memory/status') {
        response = handleMemoryStatus(request, corsHeaders);
      } else if (path === '/api/memory/optimize') {
        response = await handleMemoryOptimize(request, corsHeaders);
      } else {
        response = new Response(JSON.stringify({ error: 'Not Found' }), {
          status: 404,
          headers: { 'Content-Type': 'application/json', ...corsHeaders },
        });
      }
      
      // 성공 로깅
      const duration = Date.now() - startTime;
      logger.request(method, path, response.status, duration);
      
      return response;
      
    } catch (error) {
      const duration = Date.now() - startTime;
      logger.error('Request Failed', {
        method,
        path,
        duration: `${duration}ms`,
        error: error.message,
        stack: error.stack
      });
      return createErrorResponse(error, corsHeaders);
    }
  },
};

// 헬스 체크
function handleHealth(request, corsHeaders) {
  return createSuccessResponse({
    status: 'healthy',
    message: '수원 힐링 상담센터 API',
    version: '1.0.0'
  }, HTTP_STATUS.OK, corsHeaders);
}

// 상담사 목록 (최적화됨)
async function handleCounselors(request, env, corsHeaders) {
  const logger = getLogger();
  const cache = getCache();
  const db = getDatabase();
  const startTime = Date.now();
  
  try {
    // 캐시 완전 비활성화 - 항상 데이터베이스에서 조회
    // const cachedCounselors = await getCachedCounselors(cache);
    // if (cachedCounselors) {
    //   const responseTime = Date.now() - startTime;
    //   logger.info('Counselors served from cache', {
    //     count: cachedCounselors.counselors.length,
    //     responseTime: `${responseTime}ms`,
    //     source: 'cache'
    //   });
    //   
    //   return createSuccessResponse(cachedCounselors, HTTP_STATUS.OK, corsHeaders);
    // }

    logger.debug('Fetching counselors from database (optimized)', {
      hasDatabaseUrl: !!env.DATABASE_URL,
      hasAuthToken: !!env.DATABASE_AUTH_TOKEN
    });
    
    // 최적화된 데이터베이스 쿼리 사용
    const counselors = await db.getCounselors(true);

    // 모든 데이터 정리 (Turso null 객체 처리)
    const cleanedCounselors = cleanTursoData(counselors);

    const responseData = {
      counselors: cleanedCounselors,
      total: cleanedCounselors.length,
      page: 1,
      size: cleanedCounselors.length
    };

    // 캐시 완전 비활성화

    const responseTime = Date.now() - startTime;
    
    logger.info('Successfully fetched counselors from database (optimized)', {
      count: counselors.length,
      responseTime: `${responseTime}ms`,
      source: 'database',
      cached: true,
      optimized: true
    });
    
    return createSuccessResponse(responseData, HTTP_STATUS.OK, corsHeaders);
    
  } catch (error) {
    const responseTime = Date.now() - startTime;
    
    if (error instanceof DatabaseError) {
      logger.error('Database error in handleCounselors', {
        error: error.message,
        responseTime: `${responseTime}ms`
      });
      throw error;
    }
    
    logger.error('Unexpected error in handleCounselors', {
      error: error.message,
      responseTime: `${responseTime}ms`,
      stack: error.stack
    });
    
    handleDatabaseError(error, 'fetch counselors');
  }
}

// 상담사 생성
async function handleCreateCounselor(request, env, corsHeaders) {
  const logger = getLogger();
  const db = getDatabase();
  const startTime = Date.now();
  
  try {
    const body = await request.json();
    
    logger.debug('Creating new counselor', {
      hasName: !!body.name,
      hasEmail: !!body.email,
      hasSpecialization: !!body.specialization
    });
    
    // 입력 검증
    validateRequired(body.name, 'name');
    validateRequired(body.email, 'email');
    validateRequired(body.specialization, 'specialization');
    validateRequired(body.experience, 'experience');
    validateRequired(body.education, 'education');
    validateRequired(body.bio, 'bio');
    
    validateEmail(body.email);
    
    if (body.phone) {
      validatePhone(body.phone);
    }
    
    logger.info('Validation passed for counselor creation', {
      name: body.name,
      email: body.email,
      specialization: body.specialization
    });
    
    // 실제 데이터베이스에 상담사 생성
    const sql = `INSERT INTO counselors 
      (name, email, phone, specialization, education, experience, certification, bio, profile_image, is_online, is_active, rating, total_reviews, created_at, updated_at)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, 0, 1, 0, 0, datetime('now'), datetime('now'))`;
    
    const params = [
      body.name,
      body.email,
      body.phone || '',
      body.specialization,
      body.education,
      body.experience,
      body.certification || '',
      body.bio,
      body.profile_image || null
    ];
    
    await db.executeQuery(sql, params);
    
    // 생성된 상담사 ID 조회
    const result = await db.executeQuery('SELECT last_insert_rowid() as id');
    const newCounselorId = result[0].id;
    
    // 캐시 완전 비활성화
    
    const responseTime = Date.now() - startTime;
    
    logger.info('Counselor created successfully in database', {
      counselorId: newCounselorId,
      name: body.name,
      responseTime: `${responseTime}ms`,
      cacheInvalidated: true
    });
    
    return createSuccessResponse({
      id: newCounselorId,
      message: '상담사가 성공적으로 추가되었습니다.'
    }, HTTP_STATUS.CREATED, corsHeaders);
    
  } catch (error) {
    const responseTime = Date.now() - startTime;
    
    if (error instanceof ValidationError) {
      logger.warn('Validation failed for counselor creation', {
        error: error.message,
        responseTime: `${responseTime}ms`
      });
      throw error;
    }
    
    logger.error('Unexpected error in counselor creation', {
      error: error.message,
      responseTime: `${responseTime}ms`,
      stack: error.stack
    });
    
    throw new ValidationError('Invalid request data', { originalError: error.message });
  }
}

// 상담사 삭제
async function handleDeleteCounselor(request, env, corsHeaders, id) {
  const logger = getLogger();
  const db = getDatabase();
  const startTime = Date.now();
  
  try {
    logger.debug('Deleting counselor', { counselorId: id });
    
    // 입력 검증
    validateId(id, 'counselor');
    
    // 상담사 삭제 (실제로는 is_active를 false로 설정하는 것이 좋지만, 요청에 따라 완전 삭제)
    const sql = 'DELETE FROM counselors WHERE id = ?';
    const params = [id];
    
    await db.executeQuery(sql, params);
    
    // 캐시 완전 비활성화
    
    const responseTime = Date.now() - startTime;
    
    logger.info('Counselor deleted successfully', {
      counselorId: id,
      responseTime: `${responseTime}ms`,
      cacheInvalidated: true
    });
    
    return createSuccessResponse({
      message: '상담사가 성공적으로 삭제되었습니다.'
    }, HTTP_STATUS.OK, corsHeaders);
    
  } catch (error) {
    const responseTime = Date.now() - startTime;
    
    if (error instanceof ValidationError) {
      logger.warn('Validation failed for counselor deletion', {
        error: error.message,
        responseTime: `${responseTime}ms`
      });
      throw error;
    }
    
    logger.error('Unexpected error in counselor deletion', {
      error: error.message,
      responseTime: `${responseTime}ms`,
      stack: error.stack
    });
    
    throw new ValidationError('Invalid request data', { originalError: error.message });
  }
}

// 상담사 수정
async function handleUpdateCounselor(request, env, corsHeaders, id) {
  const logger = getLogger();
  const db = getDatabase();
  const startTime = Date.now();
  
  try {
    const body = await request.json();
    
    logger.debug('Updating counselor', { counselorId: id });
    
    // 입력 검증
    validateId(id, 'counselor');
    validateRequired(body.name, 'name');
    validateRequired(body.email, 'email');
    validateRequired(body.specialization, 'specialization');
    validateRequired(body.experience, 'experience');
    validateRequired(body.education, 'education');
    validateRequired(body.bio, 'bio');
    
    validateEmail(body.email);
    
    if (body.phone) {
      validatePhone(body.phone);
    }
    
    // 상담사 존재 확인
    const existingCounselor = await db.executeQuery('SELECT id FROM counselors WHERE id = ?', [id]);
    if (existingCounselor.length === 0) {
      throw new ValidationError('Counselor not found');
    }
    
    // 상담사 정보 업데이트
    const sql = `UPDATE counselors SET 
      name = ?, email = ?, phone = ?, specialization = ?, education = ?, 
      experience = ?, certification = ?, bio = ?, profile_image = ?, 
      updated_at = datetime('now')
      WHERE id = ?`;
    
    const params = [
      body.name,
      body.email,
      body.phone || '',
      body.specialization,
      body.education,
      body.experience,
      body.certification || '',
      body.bio,
      body.profile_image || null,
      id
    ];
    
    await db.executeQuery(sql, params);
    
    // 캐시 완전 비활성화
    
    const responseTime = Date.now() - startTime;
    
    logger.info('Counselor updated successfully', {
      counselorId: id,
      name: body.name,
      responseTime: `${responseTime}ms`
    });
    
    return createSuccessResponse({
      message: '상담사 정보가 성공적으로 수정되었습니다.'
    }, HTTP_STATUS.OK, corsHeaders);
    
  } catch (error) {
    const responseTime = Date.now() - startTime;
    
    if (error instanceof ValidationError) {
      logger.warn('Validation failed for counselor update', {
        error: error.message,
        responseTime: `${responseTime}ms`
      });
      throw error;
    }
    
    logger.error('Unexpected error in counselor update', {
      error: error.message,
      responseTime: `${responseTime}ms`,
      stack: error.stack
    });
    
    throw new ValidationError('Invalid request data', { originalError: error.message });
  }
}

// 상담사 상태 토글
async function handleToggleCounselorStatus(request, env, corsHeaders, id) {
  const logger = getLogger();
  const db = getDatabase();
  const startTime = Date.now();
  
  try {
    logger.debug('Toggling counselor status', { counselorId: id });
    
    // 입력 검증
    validateId(id, 'counselor');
    
    // 현재 상태 조회
    const currentStatus = await db.executeQuery('SELECT is_active FROM counselors WHERE id = ?', [id]);
    if (currentStatus.length === 0) {
      throw new ValidationError('Counselor not found');
    }
    
    const newStatus = currentStatus[0].is_active ? 0 : 1;
    
    // 상태 업데이트
    const sql = 'UPDATE counselors SET is_active = ?, updated_at = datetime("now") WHERE id = ?';
    const params = [newStatus, id];
    
    await db.executeQuery(sql, params);
    
    // 캐시 완전 비활성화
    
    const responseTime = Date.now() - startTime;
    
    logger.info('Counselor status toggled successfully', {
      counselorId: id,
      oldStatus: currentStatus[0].is_active,
      newStatus: newStatus,
      responseTime: `${responseTime}ms`,
      cacheInvalidated: true
    });
    
    return createSuccessResponse({
      message: `상담사가 ${newStatus ? '활성화' : '비활성화'}되었습니다.`,
      is_active: newStatus
    }, HTTP_STATUS.OK, corsHeaders);
    
  } catch (error) {
    const responseTime = Date.now() - startTime;
    
    if (error instanceof ValidationError) {
      logger.warn('Validation failed for counselor status toggle', {
        error: error.message,
        responseTime: `${responseTime}ms`
      });
      throw error;
    }
    
    logger.error('Unexpected error in counselor status toggle', {
      error: error.message,
      responseTime: `${responseTime}ms`,
      stack: error.stack
    });
    
    throw new ValidationError('Invalid request data', { originalError: error.message });
  }
}

// 특정 상담사
async function handleCounselorById(request, env, corsHeaders, id) {
  const logger = getLogger();
  const db = getDatabase();
  const startTime = Date.now();
  
  try {
    logger.debug('Fetching counselor by ID from database', { counselorId: id });
    
    // 실제 데이터베이스에서 특정 상담사 조회
    const counselors = await db.executeQuery(`
      SELECT 
        id, name, email, phone, specialization, education, experience, 
        certification, bio, profile_image, is_online, is_active, 
        rating, total_reviews, created_at, updated_at
      FROM counselors 
      WHERE id = ? AND is_active = 1
    `, [id]);
    
    if (counselors.length === 0) {
    return new Response(JSON.stringify({ error: 'Counselor not found' }), {
      status: 404,
      headers: { 'Content-Type': 'application/json', ...corsHeaders },
    });
  }

    const counselor = counselors[0];
    
    // 모든 데이터 정리 (Turso null 객체 처리)
    const cleanedCounselor = cleanTursoData(counselor);
    
    const responseTime = Date.now() - startTime;
    
    logger.info('Successfully fetched counselor by ID from database', {
      counselorId: id,
      counselorName: cleanedCounselor.name,
      responseTime: `${responseTime}ms`,
      source: 'database'
    });

    return new Response(JSON.stringify(cleanedCounselor), {
    status: 200,
    headers: { 'Content-Type': 'application/json', ...corsHeaders },
  });
    
  } catch (error) {
    const responseTime = Date.now() - startTime;
    
    logger.error('Failed to fetch counselor by ID from database', {
      counselorId: id,
      error: error.message,
      responseTime: `${responseTime}ms`,
      stack: error.stack
    });
    
    return new Response(JSON.stringify({ error: 'Internal server error' }), {
      status: 500,
    headers: { 'Content-Type': 'application/json', ...corsHeaders },
  });
  }
}

// 공지사항 목록
async function handleNotices(request, env, corsHeaders) {
  const logger = getLogger();
  const db = getDatabase();
  const startTime = Date.now();
  
  try {
    logger.debug('Fetching notices from database');
    
    // 실제 데이터베이스에서 공지사항 목록 조회
    const notices = await db.executeQuery(`
      SELECT 
        id, title, content, notice_type, status, is_pinned, is_active, 
        view_count, created_at, updated_at
      FROM notices 
      WHERE is_active = 1
      ORDER BY is_pinned DESC, created_at DESC
    `);
    
    // 모든 데이터 정리 (Turso null 객체 처리)
    const cleanedNotices = cleanTursoData(notices);
    
    const responseTime = Date.now() - startTime;
    
    logger.info('Successfully fetched notices from database', {
      count: cleanedNotices.length,
      responseTime: `${responseTime}ms`,
      source: 'database'
    });
    
    return createSuccessResponse({
      notices: cleanedNotices,
      total: cleanedNotices.length,
    page: 1,
      size: cleanedNotices.length
    }, HTTP_STATUS.OK, corsHeaders);
    
  } catch (error) {
    const responseTime = Date.now() - startTime;
    
    logger.error('Failed to fetch notices from database', {
      error: error.message,
      responseTime: `${responseTime}ms`,
      stack: error.stack
    });
    
    // 오류 발생 시 빈 배열 반환
    return createSuccessResponse({
      notices: [],
      total: 0,
      page: 1,
      size: 0
    }, HTTP_STATUS.OK, corsHeaders);
  }
}

// 특정 공지사항
async function handleNoticeById(request, env, corsHeaders, id) {
  const sampleNotices = [
    {
      id: 1,
      title: "수원 힐링 상담센터 오픈 안내",
      content: "수원 힐링 상담센터가 정식으로 오픈했습니다. 전문 상담사들과 함께 마음의 치유를 시작해보세요.",
      notice_type: "important",
      status: "published",
      is_pinned: true,
      view_count: 150,
      created_at: "2024-01-01T00:00:00Z",
      updated_at: "2024-01-01T00:00:00Z"
    },
    {
      id: 2,
      title: "새로운 상담사 영입",
      content: "청소년 상담 전문가 박마음 상담사가 팀에 합류했습니다.",
      notice_type: "general",
      status: "published",
      is_pinned: false,
      view_count: 75,
      created_at: "2024-01-02T00:00:00Z",
      updated_at: "2024-01-02T00:00:00Z"
    }
  ];
  
  const notice = sampleNotices.find(n => n.id == id);
  
  if (!notice) {
    return new Response(JSON.stringify({ error: 'Notice not found' }), {
      status: 404,
      headers: { 'Content-Type': 'application/json', ...corsHeaders },
    });
  }

  return new Response(JSON.stringify(notice), {
    status: 200,
    headers: { 'Content-Type': 'application/json', ...corsHeaders },
  });
}

// 리뷰 목록
async function handleReviews(request, env, corsHeaders) {
  const logger = getLogger();
  const db = getDatabase();
  const startTime = Date.now();
  
  try {
    logger.debug('Fetching reviews from database');
    
    // 실제 데이터베이스에서 리뷰 목록 조회 (상담사 이름과 함께)
    const reviews = await db.executeQuery(`
      SELECT 
        r.id, r.user_id, r.counselor_id, r.rating, r.title, r.content, 
        r.is_anonymous, r.is_approved, r.is_active, r.created_at, r.updated_at,
        c.name as counselor_name
      FROM reviews r
      LEFT JOIN counselors c ON r.counselor_id = c.id
      WHERE r.is_active = 1 AND r.is_approved = 1
      ORDER BY r.created_at DESC
    `);
    
    // 모든 데이터 정리 (Turso null 객체 처리)
    const cleanedReviews = cleanTursoData(reviews);
    
    const responseTime = Date.now() - startTime;
    
    logger.info('Successfully fetched reviews from database', {
      count: cleanedReviews.length,
      responseTime: `${responseTime}ms`,
      source: 'database'
    });
    
    return createSuccessResponse({
      reviews: cleanedReviews,
      total: cleanedReviews.length,
    page: 1,
      size: cleanedReviews.length
    }, HTTP_STATUS.OK, corsHeaders);
    
  } catch (error) {
    const responseTime = Date.now() - startTime;
    
    logger.error('Failed to fetch reviews from database', {
      error: error.message,
      responseTime: `${responseTime}ms`,
      stack: error.stack
    });
    
    // 오류 발생 시 빈 배열 반환
    return createSuccessResponse({
      reviews: [],
      total: 0,
      page: 1,
      size: 0
    }, HTTP_STATUS.OK, corsHeaders);
  }
}

// 특정 리뷰
async function handleReviewById(request, env, corsHeaders, id) {
  const sampleReviews = [
    {
      id: 1,
      user_id: 1,
      counselor_id: 1,
      rating: 5,
      title: "정말 도움이 되었습니다",
      content: "김상담 선생님의 따뜻한 상담 덕분에 마음이 한결 편해졌습니다. 정말 감사합니다.",
      is_anonymous: false,
      is_approved: true,
      is_active: true,
      view_count: 10,
      author_name: "김철수",
      counselor_name: "김상담",
      created_at: "2024-01-01T00:00:00Z",
      updated_at: "2024-01-01T00:00:00Z"
    },
    {
      id: 2,
      user_id: 2,
      counselor_id: 2,
      rating: 4,
      title: "부부 관계가 개선되었어요",
      content: "이치유 선생님의 부부 상담 덕분에 서로를 더 잘 이해하게 되었습니다.",
      is_anonymous: true,
      is_approved: true,
      is_active: true,
      view_count: 8,
      author_name: "익명",
      counselor_name: "이치유",
      created_at: "2024-01-02T00:00:00Z",
      updated_at: "2024-01-02T00:00:00Z"
    }
  ];
  
  const review = sampleReviews.find(r => r.id == id);
  
  if (!review) {
    return new Response(JSON.stringify({ error: 'Review not found' }), {
      status: 404,
      headers: { 'Content-Type': 'application/json', ...corsHeaders },
    });
  }

  return new Response(JSON.stringify(review), {
    status: 200,
    headers: { 'Content-Type': 'application/json', ...corsHeaders },
  });
}

// 상담 신청
async function handleConsultations(request, env, corsHeaders) {
  if (request.method === 'GET') {
    const logger = getLogger();
    const db = getDatabase();
    const startTime = Date.now();
    
    try {
      logger.debug('Fetching consultations from database');
      
        // 실제 데이터베이스에서 상담 신청 목록 조회 (상담사 이름과 한국어 매핑 포함)
        const consultations = await db.executeQuery(`
          SELECT 
            c.id, c.contact_name as user_name, c.contact_email as user_email, c.contact_phone as user_phone, 
            c.counselor_id, c.consultation_type, c.urgency_level, c.description, 
            c.preferred_date as scheduled_at, c.status, c.created_at, c.updated_at,
            co.name as counselor_name,
            ct.name_ko as consultation_type_ko,
            ul.name_ko as urgency_level_ko,
            cs.name_ko as status_ko,
            cs.color_code as status_color
          FROM consultations c
          LEFT JOIN counselors co ON c.counselor_id = co.id
          LEFT JOIN consultation_types ct ON c.consultation_type = ct.code
          LEFT JOIN urgency_levels ul ON c.urgency_level = ul.code
          LEFT JOIN consultation_statuses cs ON c.status = cs.code
          ORDER BY c.created_at DESC
        `);
        
        // 모든 데이터 정리 (Turso null 객체 처리)
        const cleanedConsultations = cleanTursoData(consultations);
        
        const responseTime = Date.now() - startTime;
        
        logger.info('Successfully fetched consultations from database', {
          count: cleanedConsultations.length,
          responseTime: `${responseTime}ms`,
          source: 'database'
        });
        
        return createSuccessResponse({
          consultations: cleanedConsultations,
          count: cleanedConsultations.length
        }, HTTP_STATUS.OK, corsHeaders);
      
    } catch (error) {
      const responseTime = Date.now() - startTime;
      
      logger.error('Failed to fetch consultations from database', {
        error: error.message,
        responseTime: `${responseTime}ms`,
        stack: error.stack
      });
      
      // 오류 발생 시 빈 배열 반환
      return createSuccessResponse({
        consultations: [],
        count: 0
      }, HTTP_STATUS.OK, corsHeaders);
    }
  } else if (request.method === 'POST') {
    const logger = getLogger();
    const startTime = Date.now();
    
    try {
      const body = await request.json();
      
      logger.debug('Processing consultation request', {
        hasUserName: !!body.user_name,
        hasUserEmail: !!body.user_email,
        hasUserPhone: !!body.user_phone,
        hasConsultationType: !!body.consultation_type,
        hasCounselorId: !!body.counselor_id
      });
      
      // 입력 검증
      validateRequired(body.user_name, 'user_name');
      validateRequired(body.user_email, 'user_email');
      validateRequired(body.user_phone, 'user_phone');
      validateRequired(body.consultation_type, 'consultation_type');
      
      validateEmail(body.user_email);
      validatePhone(body.user_phone);
      
      if (body.counselor_id) {
        validateId(String(body.counselor_id), 'counselor');
      }
      
      logger.info('Validation passed for consultation request', {
        userEmail: body.user_email,
        consultationType: body.consultation_type
      });
      
      // 실제 데이터베이스에 상담 신청 저장
      const db = getDatabase();
      const sql = `INSERT INTO consultations 
        (contact_name, contact_email, contact_phone, counselor_id, consultation_type, 
         urgency_level, description, preferred_date, status, created_at, updated_at)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, 'PENDING', datetime('now'), datetime('now'))`;
      
      const params = [
        body.user_name,
        body.user_email,
        body.user_phone,
        String(body.counselor_id), // 문자열로 변환
        body.consultation_type,
        body.urgency_level,
        body.description,
        body.scheduled_at
      ];
      
      await db.executeQuery(sql, params);
      
      // 생성된 상담 신청 ID 조회
      const result = await db.executeQuery('SELECT last_insert_rowid() as id');
      const newConsultationId = result[0].id;
      
      const responseTime = Date.now() - startTime;
      
      logger.info('Consultation request created successfully', {
        consultationId: newConsultationId,
        userEmail: body.user_email,
        responseTime: `${responseTime}ms`
      });
      
      return createSuccessResponse({
        id: newConsultationId,
        message: '상담 신청이 완료되었습니다.'
      }, HTTP_STATUS.CREATED, corsHeaders);
      
    } catch (error) {
      const responseTime = Date.now() - startTime;
      
      if (error instanceof ValidationError) {
        logger.warn('Validation failed for consultation request', {
          error: error.message,
          responseTime: `${responseTime}ms`
        });
        throw error;
      }
      
      logger.error('Unexpected error in consultation request', {
        error: error.message,
        responseTime: `${responseTime}ms`,
        stack: error.stack
      });
      
      throw new ValidationError('Invalid request data', { originalError: error.message });
    }
  }
}

// OpenAPI 스펙 제공
async function handleOpenAPI(request, corsHeaders) {
  try {
    // OpenAPI 스펙 파일 읽기
    const openAPISpec = await import('./openapi.json', { assert: { type: 'json' } });
    
    return new Response(JSON.stringify(openAPISpec.default), {
      status: 200,
      headers: { 
        'Content-Type': 'application/json',
        'Cache-Control': 'public, max-age=3600', // 1시간 캐시
        ...corsHeaders 
      },
    });
  } catch (error) {
    logError(error, { operation: 'load OpenAPI spec' });
    return createErrorResponse(error, corsHeaders);
  }
}

// API 문서 페이지 제공
async function handleAPIDocs(request, corsHeaders) {
  const html = `
<!DOCTYPE html>
<html lang="ko">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>수원 힐링 상담센터 API 문서</title>
    <link rel="stylesheet" type="text/css" href="https://unpkg.com/swagger-ui-dist@5.9.0/swagger-ui.css" />
    <style>
        html {
            box-sizing: border-box;
            overflow: -moz-scrollbars-vertical;
            overflow-y: scroll;
        }
        *, *:before, *:after {
            box-sizing: inherit;
        }
        body {
            margin:0;
            background: #fafafa;
        }
    </style>
</head>
<body>
    <div id="swagger-ui"></div>
    <script src="https://unpkg.com/swagger-ui-dist@5.9.0/swagger-ui-bundle.js"></script>
    <script src="https://unpkg.com/swagger-ui-dist@5.9.0/swagger-ui-standalone-preset.js"></script>
    <script>
        window.onload = function() {
            const ui = SwaggerUIBundle({
                url: '/openapi.json',
                dom_id: '#swagger-ui',
                deepLinking: true,
                presets: [
                    SwaggerUIBundle.presets.apis,
                    SwaggerUIStandalonePreset
                ],
                plugins: [
                    SwaggerUIBundle.plugins.DownloadUrl
                ],
                layout: "StandaloneLayout",
                validatorUrl: null,
                tryItOutEnabled: true,
                supportedSubmitMethods: ['get', 'post', 'put', 'delete', 'patch'],
                onComplete: function() {
                    console.log('API 문서가 로드되었습니다.');
                }
            });
        };
    </script>
</body>
</html>`;

  return new Response(html, {
    status: 200,
    headers: { 
      'Content-Type': 'text/html; charset=utf-8',
      'Cache-Control': 'public, max-age=3600',
      ...corsHeaders 
    },
  });
}

// 메트릭 조회
function handleMetrics(request, corsHeaders) {
  const logger = getLogger();
  const cache = getCache();
  
  try {
    const metrics = logger.getMetrics();
    const cacheStatus = getCacheStatus(cache);
    
    logger.debug('Metrics requested', { 
      requestCount: metrics.requests,
      errorCount: metrics.errors,
      cacheAvailable: cacheStatus.available
    });
    
    return createSuccessResponse({
      metrics: {
        ...metrics,
        uptime: 'N/A', // Cloudflare Workers에서는 process.uptime() 사용 불가
        memory: 'N/A'  // Cloudflare Workers에서는 process.memoryUsage() 사용 불가
      },
      cache: cacheStatus,
      timestamp: new Date().toISOString()
    }, HTTP_STATUS.OK, corsHeaders);
    
  } catch (error) {
    logger.error('Failed to get metrics', { error: error.message });
    return createErrorResponse(error, corsHeaders);
  }
}

// 캐시 상태 조회
function handleCacheStatus(request, corsHeaders) {
  const logger = getLogger();
  const cache = getCache();
  
  try {
    const cacheStatus = getCacheStatus(cache);
    
    logger.debug('Cache status requested', { 
      available: cacheStatus.available,
      memorySize: cacheStatus.memory?.size || 0
    });
    
    return createSuccessResponse({
      cache: cacheStatus,
      timestamp: new Date().toISOString()
    }, HTTP_STATUS.OK, corsHeaders);
    
  } catch (error) {
    logger.error('Failed to get cache status', { error: error.message });
    return createErrorResponse(error, corsHeaders);
  }
}

// 캐시 초기화
async function handleCacheClear(request, corsHeaders) {
  const logger = getLogger();
  const cache = getCache();
  
  try {
    if (!cache) {
      return createErrorResponse(
        new Error('Cache not available'), 
        corsHeaders
      );
    }

    await cache.clear();
    
    logger.info('Cache cleared successfully');
    
    return createSuccessResponse({
      message: 'Cache cleared successfully',
      timestamp: new Date().toISOString()
    }, HTTP_STATUS.OK, corsHeaders);
    
  } catch (error) {
    logger.error('Failed to clear cache', { error: error.message });
    return createErrorResponse(error, corsHeaders);
  }
}

// 대시보드 데이터 (병렬 처리 예시)
async function handleDashboard(request, corsHeaders) {
  const logger = getLogger();
  const cache = getCache();
  const db = getDatabase();
  const startTime = Date.now();
  
  try {
    // 병렬로 여러 데이터 조회
    const [counselors, notices, reviews, stats] = await Promise.all([
      db.getCounselors(true),
      db.getNotices(true),
      db.getReviews(true),
      db.getDatabaseStats()
    ]);

    const responseTime = Date.now() - startTime;
    
    logger.info('Dashboard data fetched in parallel', {
      counselorCount: counselors.length,
      noticeCount: notices.length,
      reviewCount: reviews.length,
      responseTime: `${responseTime}ms`,
      parallel: true
    });

    const dashboardData = {
      summary: {
        totalCounselors: counselors.length,
        totalNotices: notices.length,
        totalReviews: reviews.length,
        totalConsultations: stats.consultations
      },
      recent: {
        counselors: counselors.slice(0, 3), // 최근 3명
        notices: notices.slice(0, 3),       // 최근 3개
        reviews: reviews.slice(0, 3)        // 최근 3개
      },
      stats: stats
    };

    return createSuccessResponse(dashboardData, HTTP_STATUS.OK, corsHeaders);
    
  } catch (error) {
    const responseTime = Date.now() - startTime;
    
    logger.error('Failed to fetch dashboard data', {
      error: error.message,
      responseTime: `${responseTime}ms`
    });
    
    return createErrorResponse(error, corsHeaders);
  }
}

// 메모리 상태 조회
function handleMemoryStatus(request, corsHeaders) {
  const logger = getLogger();
  
  try {
    const memoryStatus = getMemoryStatus();
    
    logger.debug('Memory status requested', { 
      available: memoryStatus.available,
      pressure: memoryStatus.pressure
    });
    
    return createSuccessResponse({
      memory: memoryStatus,
      timestamp: new Date().toISOString()
    }, HTTP_STATUS.OK, corsHeaders);
    
  } catch (error) {
    logger.error('Failed to get memory status', { error: error.message });
    return createErrorResponse(error, corsHeaders);
  }
}

// 메모리 최적화 실행
async function handleMemoryOptimize(request, corsHeaders) {
  const logger = getLogger();
  
  try {
    const optimized = optimizeMemory();
    
    logger.info('Memory optimization performed', { 
      optimized: optimized
    });
    
    return createSuccessResponse({
      optimized: optimized,
      message: optimized 
        ? 'Memory optimization completed' 
        : 'No memory optimization needed',
      timestamp: new Date().toISOString()
    }, HTTP_STATUS.OK, corsHeaders);
    
  } catch (error) {
    logger.error('Failed to optimize memory', { error: error.message });
    return createErrorResponse(error, corsHeaders);
  }
}

// 상담 상태 정의
const CONSULTATION_STATUS = {
  PENDING: 'PENDING',        // 대기중 (신청 접수)
  REVIEWING: 'REVIEWING',    // 검토중 (상담사가 검토)
  CONFIRMED: 'CONFIRMED',    // 확정됨 (상담사가 수락)
  SCHEDULED: 'SCHEDULED',    // 일정 확정 (구체적 시간 확정)
  IN_PROGRESS: 'IN_PROGRESS', // 진행중 (상담 시작)
  COMPLETED: 'COMPLETED',    // 완료됨 (상담 종료)
  CANCELLED: 'CANCELLED',    // 취소됨 (신청자 또는 상담사 취소)
  REJECTED: 'REJECTED'       // 거절됨 (상담사가 거절)
};

// 상담 상태별 한글 표시
const CONSULTATION_STATUS_LABELS = {
  [CONSULTATION_STATUS.PENDING]: '대기중',
  [CONSULTATION_STATUS.REVIEWING]: '검토중',
  [CONSULTATION_STATUS.CONFIRMED]: '수락됨',
  [CONSULTATION_STATUS.SCHEDULED]: '일정확정',
  [CONSULTATION_STATUS.IN_PROGRESS]: '진행중',
  [CONSULTATION_STATUS.COMPLETED]: '완료됨',
  [CONSULTATION_STATUS.CANCELLED]: '취소됨',
  [CONSULTATION_STATUS.REJECTED]: '거절됨'
};

// 상담 상태별 색상
const CONSULTATION_STATUS_COLORS = {
  [CONSULTATION_STATUS.PENDING]: 'bg-yellow-100 text-yellow-800',
  [CONSULTATION_STATUS.REVIEWING]: 'bg-blue-100 text-blue-800',
  [CONSULTATION_STATUS.CONFIRMED]: 'bg-green-100 text-green-800',
  [CONSULTATION_STATUS.SCHEDULED]: 'bg-purple-100 text-purple-800',
  [CONSULTATION_STATUS.IN_PROGRESS]: 'bg-orange-100 text-orange-800',
  [CONSULTATION_STATUS.COMPLETED]: 'bg-gray-100 text-gray-800',
  [CONSULTATION_STATUS.CANCELLED]: 'bg-red-100 text-red-800',
  [CONSULTATION_STATUS.REJECTED]: 'bg-red-100 text-red-800'
};

// 데이터 정리 함수 - Turso의 null 객체를 실제 null로 변환
function cleanTursoData(data) {
  if (Array.isArray(data)) {
    return data.map(item => cleanTursoData(item));
  }
  
  if (data && typeof data === 'object') {
    const cleaned = {};
    for (const [key, value] of Object.entries(data)) {
      if (value && typeof value === 'object' && value.type === 'null') {
        cleaned[key] = null;
      } else if (typeof value === 'string' && (value === '[object Object]' || value === 'null')) {
        cleaned[key] = null;
      } else if (value && typeof value === 'object' && !Array.isArray(value)) {
        cleaned[key] = cleanTursoData(value);
      } else {
        cleaned[key] = value;
      }
    }
    return cleaned;
  }
  
  return data;
}

// 상담 상태 업데이트 처리
async function handleUpdateConsultationStatus(request, env, corsHeaders, id) {
  const logger = getLogger();
  const db = getDatabase();
  const startTime = Date.now();
  
  try {
    const body = await request.json();
    
    logger.debug('Updating consultation status', {
      consultationId: id,
      newStatus: body.status,
      action: body.action
    });
    
    // 입력 검증
    validateId(id, 'consultation');
    validateRequired(body.status, 'status');
    
    // 유효한 상태인지 확인
    const validStatuses = Object.values(CONSULTATION_STATUS);
    if (!validStatuses.includes(body.status)) {
      throw new ValidationError('Invalid consultation status', {
        provided: body.status,
        validStatuses: validStatuses
      });
    }
    
    // 상담 신청 존재 여부 확인
    const existingConsultation = await db.executeQuery(
      'SELECT id, status, counselor_id FROM consultations WHERE id = ?',
      [id]
    );
    
    if (existingConsultation.length === 0) {
      throw new NotFoundError('Consultation not found');
    }
    
    const currentConsultation = existingConsultation[0];
    
    // 상태 전환 검증
    const validTransitions = {
      [CONSULTATION_STATUS.PENDING]: [CONSULTATION_STATUS.REVIEWING, CONSULTATION_STATUS.CANCELLED],
      [CONSULTATION_STATUS.REVIEWING]: [CONSULTATION_STATUS.CONFIRMED, CONSULTATION_STATUS.REJECTED, CONSULTATION_STATUS.CANCELLED],
      [CONSULTATION_STATUS.CONFIRMED]: [CONSULTATION_STATUS.SCHEDULED, CONSULTATION_STATUS.CANCELLED],
      [CONSULTATION_STATUS.SCHEDULED]: [CONSULTATION_STATUS.IN_PROGRESS, CONSULTATION_STATUS.CANCELLED],
      [CONSULTATION_STATUS.IN_PROGRESS]: [CONSULTATION_STATUS.COMPLETED, CONSULTATION_STATUS.CANCELLED],
      [CONSULTATION_STATUS.COMPLETED]: [], // 완료된 상담은 더 이상 변경 불가
      [CONSULTATION_STATUS.CANCELLED]: [], // 취소된 상담은 더 이상 변경 불가
      [CONSULTATION_STATUS.REJECTED]: []   // 거절된 상담은 더 이상 변경 불가
    };
    
    const currentStatus = currentConsultation.status;
    const newStatus = body.status;
    
    if (!validTransitions[currentStatus]?.includes(newStatus)) {
      throw new ValidationError('Invalid status transition', {
        currentStatus: currentStatus,
        newStatus: newStatus,
        validTransitions: validTransitions[currentStatus] || []
      });
    }
    
    // 상태 업데이트
    let updateSql = 'UPDATE consultations SET status = ?, updated_at = datetime("now")';
    let params = [newStatus];
    
    // 특별한 상태별 추가 처리
    if (newStatus === CONSULTATION_STATUS.SCHEDULED && body.scheduled_at) {
      updateSql += ', preferred_date = ?';
      params.push(body.scheduled_at);
    }
    
    if (newStatus === CONSULTATION_STATUS.IN_PROGRESS) {
      updateSql += ', started_at = datetime("now")';
    }
    
    if (newStatus === CONSULTATION_STATUS.COMPLETED) {
      updateSql += ', completed_at = datetime("now")';
    }
    
    if (newStatus === CONSULTATION_STATUS.CANCELLED || newStatus === CONSULTATION_STATUS.REJECTED) {
      updateSql += ', cancelled_at = datetime("now")';
      if (body.reason) {
        updateSql += ', cancellation_reason = ?';
        params.push(body.reason);
      }
    }
    
    // WHERE 절 추가
    updateSql += ' WHERE id = ?';
    params.push(id);
    
    await db.executeQuery(updateSql, params);
    
    const responseTime = Date.now() - startTime;
    
    logger.info('Consultation status updated successfully', {
      consultationId: id,
      oldStatus: currentStatus,
      newStatus: newStatus,
      responseTime: `${responseTime}ms`
    });
    
    return createSuccessResponse({
      id: id,
      status: newStatus,
      message: `상담 상태가 ${CONSULTATION_STATUS_LABELS[newStatus]}로 변경되었습니다.`
    }, HTTP_STATUS.OK, corsHeaders);
    
  } catch (error) {
    const responseTime = Date.now() - startTime;
    
    logger.error('Failed to update consultation status', {
      consultationId: id,
      error: error.message,
      responseTime: `${responseTime}ms`,
      stack: error.stack
    });
    
    return createErrorResponse(error, corsHeaders);
  }
}

// 특정 상담 신청 조회
async function handleConsultationById(request, env, corsHeaders, id) {
  const logger = getLogger();
  const db = getDatabase();
  const startTime = Date.now();
  
  try {
    logger.debug('Fetching consultation by ID from database', { consultationId: id });
    
    // 상담사 이름과 한국어 매핑과 함께 상담 신청 조회
    const consultations = await db.executeQuery(`
      SELECT 
        c.id, c.contact_name as user_name, c.contact_email as user_email, c.contact_phone as user_phone, 
        c.counselor_id, c.consultation_type, c.urgency_level, c.description, 
        c.preferred_date as scheduled_at, c.status, c.created_at, c.updated_at,
        co.name as counselor_name, co.email as counselor_email, co.phone as counselor_phone,
        ct.name_ko as consultation_type_ko,
        ul.name_ko as urgency_level_ko,
        cs.name_ko as status_ko,
        cs.color_code as status_color
      FROM consultations c
      LEFT JOIN counselors co ON c.counselor_id = co.id
      LEFT JOIN consultation_types ct ON c.consultation_type = ct.code
      LEFT JOIN urgency_levels ul ON c.urgency_level = ul.code
      LEFT JOIN consultation_statuses cs ON c.status = cs.code
      WHERE c.id = ?
    `, [id]);
    
    if (consultations.length === 0) {
      throw new NotFoundError('Consultation not found');
    }
    
    const consultation = consultations[0];
    
    // 모든 데이터 정리 (Turso null 객체 처리)
    const cleanedConsultation = cleanTursoData(consultation);
    
    const responseTime = Date.now() - startTime;
    
    logger.info('Successfully fetched consultation by ID from database', {
      consultationId: id,
      status: cleanedConsultation.status,
      responseTime: `${responseTime}ms`,
      source: 'database'
    });

    return new Response(JSON.stringify(cleanedConsultation), {
      status: 200,
      headers: { 'Content-Type': 'application/json', ...corsHeaders },
    });
    
  } catch (error) {
    const responseTime = Date.now() - startTime;
    
    logger.error('Failed to fetch consultation by ID from database', {
      consultationId: id,
      error: error.message,
      responseTime: `${responseTime}ms`,
      stack: error.stack
    });
    
    return createErrorResponse(error, corsHeaders);
  }
}
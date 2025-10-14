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

export default {
  async fetch(request, env, ctx) {
    // 로거 초기화
    const logger = initLogger(env);
    
    // 캐시 초기화
    const cache = initCache(env.CACHE);
    
    // 데이터베이스 초기화
    const db = initDatabase(env);
    
    const startTime = Date.now();
    
    // CORS 헤더 설정
    const corsHeaders = {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
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
        response = await handleCounselors(request, env, corsHeaders);
      } else if (path.startsWith('/api/counselors/')) {
        const id = path.split('/')[3];
        response = await handleCounselorById(request, env, corsHeaders, id);
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
    // 캐시에서 조회 시도
    const cachedCounselors = await getCachedCounselors(cache);
    if (cachedCounselors) {
      const responseTime = Date.now() - startTime;
      logger.info('Counselors served from cache', {
        count: cachedCounselors.counselors.length,
        responseTime: `${responseTime}ms`,
        source: 'cache'
      });
      
      return createSuccessResponse(cachedCounselors, HTTP_STATUS.OK, corsHeaders);
    }

    logger.debug('Fetching counselors from database (optimized)', {
      hasDatabaseUrl: !!env.DATABASE_URL,
      hasAuthToken: !!env.DATABASE_AUTH_TOKEN
    });
    
    // 최적화된 데이터베이스 쿼리 사용
    const counselors = await db.getCounselors(true);

    const responseData = {
      counselors: counselors,
      total: counselors.length,
      page: 1,
      size: counselors.length
    };

    // 캐시에 저장
    await cacheCounselors(cache, responseData);

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

// 특정 상담사
async function handleCounselorById(request, env, corsHeaders, id) {
  const sampleCounselors = [
    {
      id: 1,
      name: "김상담",
      email: "counselor1@suwon-healing.com",
      phone: "010-1000-1000",
      specialization: "개인상담",
      education: "서울대학교 심리학과 졸업",
      experience: "10년",
      bio: "따뜻하고 전문적인 상담을 제공합니다.",
      profile_image: "/images/counselor1.jpg",
      is_online: true,
      is_active: true,
      rating: 4.8,
      total_reviews: 25,
      created_at: "2024-01-01T00:00:00Z",
      updated_at: "2024-01-01T00:00:00Z"
    },
    {
      id: 2,
      name: "이치유",
      email: "counselor2@suwon-healing.com",
      phone: "010-2000-2000",
      specialization: "부부상담",
      education: "연세대학교 상담심리학과 졸업",
      experience: "8년",
      bio: "부부 관계 개선을 위한 전문적인 상담을 제공합니다.",
      profile_image: "/images/counselor2.jpg",
      is_online: true,
      is_active: true,
      rating: 4.9,
      total_reviews: 30,
      created_at: "2024-01-01T00:00:00Z",
      updated_at: "2024-01-01T00:00:00Z"
    },
    {
      id: 3,
      name: "박마음",
      email: "counselor3@suwon-healing.com",
      phone: "010-3000-3000",
      specialization: "청소년상담",
      education: "고려대학교 아동심리학과 졸업",
      experience: "12년",
      bio: "청소년의 마음을 이해하고 성장을 돕습니다.",
      profile_image: "/images/counselor3.jpg",
      is_online: false,
      is_active: true,
      rating: 4.7,
      total_reviews: 20,
      created_at: "2024-01-01T00:00:00Z",
      updated_at: "2024-01-01T00:00:00Z"
    }
  ];
  
  const counselor = sampleCounselors.find(c => c.id == id);
  
  if (!counselor) {
    return new Response(JSON.stringify({ error: 'Counselor not found' }), {
      status: 404,
      headers: { 'Content-Type': 'application/json', ...corsHeaders },
    });
  }

  return new Response(JSON.stringify(counselor), {
    status: 200,
    headers: { 'Content-Type': 'application/json', ...corsHeaders },
  });
}

// 공지사항 목록
async function handleNotices(request, env, corsHeaders) {
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
  
  return new Response(JSON.stringify({
    notices: sampleNotices,
    total: sampleNotices.length,
    page: 1,
    size: sampleNotices.length
  }), {
    status: 200,
    headers: { 'Content-Type': 'application/json', ...corsHeaders },
  });
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
  
  return new Response(JSON.stringify({
    reviews: sampleReviews,
    total: sampleReviews.length,
    page: 1,
    size: sampleReviews.length
  }), {
    status: 200,
    headers: { 'Content-Type': 'application/json', ...corsHeaders },
  });
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
    const sampleConsultations = [
      {
        id: 1,
        user_name: "김철수",
        user_email: "kim@example.com",
        user_phone: "010-1111-1111",
        counselor_id: 1,
        consultation_type: "개인상담",
        preferred_date: "2024-01-15",
        preferred_time: "14:00",
        message: "스트레스 관리에 대해 상담받고 싶습니다.",
        status: "pending",
        created_at: "2024-01-01T00:00:00Z",
        updated_at: "2024-01-01T00:00:00Z"
      }
    ];
    
    return new Response(JSON.stringify({
      consultations: sampleConsultations,
      count: sampleConsultations.length
    }), {
      status: 200,
      headers: { 'Content-Type': 'application/json', ...corsHeaders },
    });
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
        validateId(body.counselor_id, 'counselor');
      }
      
      logger.info('Validation passed for consultation request', {
        userEmail: body.user_email,
        consultationType: body.consultation_type
      });
      
      // 상담 신청 처리 (실제로는 데이터베이스에 저장)
      const newConsultation = {
        id: Date.now(),
        ...body,
        status: 'pending',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      };
      
      const responseTime = Date.now() - startTime;
      
      logger.info('Consultation request created successfully', {
        consultationId: newConsultation.id,
        userEmail: body.user_email,
        responseTime: `${responseTime}ms`
      });
      
      return createSuccessResponse({
        id: newConsultation.id,
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
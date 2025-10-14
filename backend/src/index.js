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

export default {
  async fetch(request, env, ctx) {
    // CORS 헤더 설정
    const corsHeaders = {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    };

    // OPTIONS 요청 처리 (CORS preflight)
    if (request.method === 'OPTIONS') {
      return new Response(null, {
        status: 200,
        headers: corsHeaders,
      });
    }

    const url = new URL(request.url);
    const path = url.pathname;
    const method = request.method;

    try {
      // API 라우팅
      if (path === '/api/health') {
        return handleHealth(request, corsHeaders);
      } else if (path === '/api/counselors') {
        return await handleCounselors(request, env, corsHeaders);
      } else if (path.startsWith('/api/counselors/')) {
        const id = path.split('/')[3];
        return await handleCounselorById(request, env, corsHeaders, id);
      } else if (path === '/api/notices') {
        return await handleNotices(request, env, corsHeaders);
      } else if (path.startsWith('/api/notices/')) {
        const id = path.split('/')[3];
        return await handleNoticeById(request, env, corsHeaders, id);
      } else if (path === '/api/reviews') {
        return await handleReviews(request, env, corsHeaders);
      } else if (path.startsWith('/api/reviews/')) {
        const id = path.split('/')[3];
        return await handleReviewById(request, env, corsHeaders, id);
      } else if (path === '/api/consultations') {
        return await handleConsultations(request, env, corsHeaders);
      } else if (path === '/openapi.json') {
        return handleOpenAPI(request, corsHeaders);
      } else if (path === '/docs' || path === '/api-docs') {
        return handleAPIDocs(request, corsHeaders);
      } else {
        return new Response(JSON.stringify({ error: 'Not Found' }), {
          status: 404,
          headers: { 'Content-Type': 'application/json', ...corsHeaders },
        });
      }
    } catch (error) {
      logError(error, { path, method });
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

// 상담사 목록
async function handleCounselors(request, env, corsHeaders) {
  try {
    console.log('🔗 데이터베이스 연결 시도...');
    console.log('DATABASE_URL:', env.DATABASE_URL);
    console.log('AUTH_TOKEN 존재:', !!env.DATABASE_AUTH_TOKEN);
    
    // Turso HTTP API 사용 (libsql://을 https://로 변환)
    const httpUrl = env.DATABASE_URL.replace('libsql://', 'https://');
    
    // 임시로 하드코딩된 토큰 사용 (테스트용)
    const authToken = env.DATABASE_AUTH_TOKEN || 'eyJhbGciOiJFZERTQSIsInR5cCI6IkpXVCJ9.eyJhIjoicnciLCJnaWQiOiI2NTE5YTM5Zi1kZTc5LTQxNGYtOTA0ZC1kOGI2NDliMDZmN2MiLCJpYXQiOjE3NTQ0NDMzOTksInJpZCI6IjA5OGQzZTNhLWE0OWMtNGQ0NC04MGIxLWVjOTM3MzY4YjQ5MSJ9.FZgSEU3NZJj7lhaLHfnNg6KxoLUGO9u9MLsa9nLI3HBCKVf6Ke1O4-m0WMs_CQdtcLEAYL3xNIID8E8HnRqzAA';
    
    const response = await fetch(`${httpUrl}/v1/execute`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${authToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        stmt: {
          sql: 'SELECT * FROM counselors'
        }
      })
    });

    console.log('응답 상태:', response.status);
    console.log('응답 헤더:', Object.fromEntries(response.headers.entries()));

    if (!response.ok) {
      const errorText = await response.text();
      console.error('데이터베이스 요청 실패:', response.status, errorText);
      throw new Error(`Database request failed: ${response.status} - ${errorText}`);
    }

    const data = await response.json();
    console.log('데이터베이스 응답:', data);
    console.log('응답 구조:', Object.keys(data));
    
    // Turso 응답 구조에 따라 데이터 추출 및 변환
    const rawRows = data.result?.rows || [];
    const columns = data.result?.cols || [];
    
    const counselors = rawRows.map(row => {
      const counselor = {};
      columns.forEach((col, index) => {
        const value = row[index];
        counselor[col.name] = value?.value || value;
      });
      return counselor;
    });
    
    console.log('변환된 상담사 데이터:', counselors);
    
    return new Response(JSON.stringify({
      counselors: counselors,
      total: counselors.length,
      page: 1,
      size: counselors.length
    }), {
      status: 200,
      headers: { 'Content-Type': 'application/json', ...corsHeaders },
    });
  } catch (error) {
    if (error instanceof DatabaseError) {
      throw error;
    }
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
    try {
      const body = await request.json();
      
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
      
      // 상담 신청 처리 (실제로는 데이터베이스에 저장)
      const newConsultation = {
        id: Date.now(),
        ...body,
        status: 'pending',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      };
      
      return createSuccessResponse({
        id: newConsultation.id,
        message: '상담 신청이 완료되었습니다.'
      }, HTTP_STATUS.CREATED, corsHeaders);
      
    } catch (error) {
      if (error instanceof ValidationError) {
        throw error;
      }
      logError(error, { operation: 'consultation validation' });
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
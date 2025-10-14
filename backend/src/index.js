/**
 * Cloudflare Workers용 간단한 API
 */

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

    // 요청 정보 파싱
    const url = new URL(request.url);
    const method = request.method;

    // 응답 데이터
    const responseData = {
      message: "수원 힐링 상담센터 API",
      version: "1.0.0",
      platform: "Cloudflare Workers",
      method: method,
      url: url.toString(),
      status: "healthy",
      timestamp: new Date().toISOString(),
    };

    // JSON 응답 반환
    return new Response(JSON.stringify(responseData, null, 2), {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
        ...corsHeaders,
      },
    });
  },
};

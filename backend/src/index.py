"""
Cloudflare Workers용 간단한 API 테스트
"""
import json
from typing import Dict, Any

def fetch(request):
    """Cloudflare Workers fetch 핸들러"""
    
    # 요청 정보 파싱
    url = str(request.url)
    method = request.method
    
    # 응답 데이터
    response_data = {
        "message": "수원 힐링 상담센터 API",
        "version": "1.0.0",
        "platform": "Cloudflare Workers",
        "method": method,
        "url": url,
        "status": "healthy"
    }
    
    # JSON 응답 반환
    return Response(
        json.dumps(response_data, ensure_ascii=False),
        status=200,
        headers={
            "Content-Type": "application/json",
            "Access-Control-Allow-Origin": "*",
            "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
            "Access-Control-Allow-Headers": "Content-Type, Authorization"
        }
    )
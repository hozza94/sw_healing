"""
Turso 데이터베이스 클라이언트
"""
import asyncio
from libsql_client import create_client
from .config import settings

class TursoClient:
    def __init__(self):
        self.url = settings.DATABASE_URL
        self.auth_token = settings.DATABASE_AUTH_TOKEN
        self.client = None
    
    async def connect(self):
        """Turso 데이터베이스에 연결"""
        try:
            self.client = create_client(
                url=self.url,
                auth_token=self.auth_token
            )
            print(f"✅ Turso 연결 성공: {self.url}")
            return True
        except Exception as e:
            print(f"❌ Turso 연결 실패: {e}")
            return False
    
    async def execute(self, query, params=None):
        """쿼리 실행"""
        if not self.client:
            await self.connect()
        
        try:
            if params:
                result = await self.client.execute(query, params)
            else:
                result = await self.client.execute(query)
            return result
        except Exception as e:
            print(f"❌ 쿼리 실행 실패: {e}")
            return None
    
    async def close(self):
        """연결 종료"""
        if self.client:
            await self.client.close()

# 전역 Turso 클라이언트 인스턴스
turso_client = TursoClient() 
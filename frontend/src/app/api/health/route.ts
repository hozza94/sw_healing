import { NextResponse } from 'next/server'
import { createClient } from '@libsql/client'

export async function GET() {
  try {
    // 환경 변수 체크
    const databaseUrl = process.env.DATABASE_URL
    const authToken = process.env.DATABASE_AUTH_TOKEN
    
    if (!databaseUrl) {
      return NextResponse.json({ 
        status: "error",
        message: "DATABASE_URL이 설정되지 않았습니다.",
        version: "1.0.0"
      }, { status: 500 })
    }

    // 데이터베이스 연결 테스트
    const client = createClient({
      url: databaseUrl,
      authToken: authToken,
    })

    // 간단한 쿼리로 연결 테스트
    await client.execute('SELECT 1')

    return NextResponse.json({ 
      status: "healthy",
      message: "수원 힐링 상담센터 API",
      version: "1.0.0",
      database: "connected"
    })
  } catch (error) {
    console.error('Health check error:', error)
    return NextResponse.json({ 
      status: "error",
      message: "데이터베이스 연결 실패",
      version: "1.0.0",
      error: error instanceof Error ? error.message : "Unknown error"
    }, { status: 500 })
  }
}

import { NextResponse } from 'next/server'
import { createClient } from '@libsql/client'

export async function GET() {
  try {
    console.log('GET /api/counselors - 시작')
    
    const databaseUrl = process.env.DATABASE_URL
    const authToken = process.env.DATABASE_AUTH_TOKEN
    
    console.log('환경 변수 확인:', { 
      hasDatabaseUrl: !!databaseUrl, 
      hasAuthToken: !!authToken,
      databaseUrl: databaseUrl ? databaseUrl.substring(0, 50) + '...' : 'undefined'
    })
    
    if (!databaseUrl) {
      console.log('DATABASE_URL이 설정되지 않음')
      return NextResponse.json(
        { error: 'DATABASE_URL이 설정되지 않았습니다.' },
        { status: 500 }
      )
    }

    console.log('Turso 클라이언트 생성 중...')
    const client = createClient({
      url: databaseUrl,
      authToken: authToken,
    })

    console.log('데이터베이스 쿼리 실행 중...')
    
    // 먼저 테이블 존재 여부 확인
    const tables = await client.execute("SELECT name FROM sqlite_master WHERE type='table'")
    console.log('사용 가능한 테이블:', tables.rows.map(row => row.name))
    
    const result = await client.execute('SELECT * FROM counselors WHERE is_active = true')
    
    console.log('쿼리 결과:', { 
      rowCount: result.rows.length,
      columns: result.columns 
    })
    
    return NextResponse.json({
      counselors: result.rows,
      count: result.rows.length
    })
  } catch (error) {
    console.error('Error fetching counselors:', error)
    return NextResponse.json(
      { 
        error: 'Internal Server Error',
        details: error instanceof Error ? error.message : 'Unknown error',
        stack: error instanceof Error ? error.stack : undefined
      },
      { status: 500 }
    )
  }
}

export async function POST(request: Request) {
  try {
    console.log('POST /api/counselors - 시작')
    
    const databaseUrl = process.env.DATABASE_URL
    const authToken = process.env.DATABASE_AUTH_TOKEN
    
    if (!databaseUrl) {
      return NextResponse.json(
        { error: 'DATABASE_URL이 설정되지 않았습니다.' },
        { status: 500 }
      )
    }

    const client = createClient({
      url: databaseUrl,
      authToken: authToken,
    })

    const body = await request.json()
    
    // 상담사 생성 로직
    const { name, email, phone, specialization, education, experience, certification, bio } = body
    
    // 데이터 타입 안전하게 변환
    const safeArgs = [
      name ? String(name) : '',
      email ? String(email) : '',
      phone ? String(phone) : null,
      specialization ? String(specialization) : null,
      education ? String(education) : null,
      experience ? String(experience) : null,
      certification ? String(certification) : null,
      bio ? String(bio) : null
    ]
    
    console.log('전송할 데이터:', safeArgs)
    
    const result = await client.execute({
      sql: `INSERT INTO counselors (name, email, phone, specialization, education, experience, certification, bio, is_online, is_active, rating, total_reviews) 
             VALUES (?, ?, ?, ?, ?, ?, ?, ?, true, true, 0.0, 0)`,
      args: safeArgs
    })
    
    return NextResponse.json({
      message: '상담사가 성공적으로 등록되었습니다.',
      id: Number(result.lastInsertRowid)
    })
  } catch (error) {
    console.error('Error creating counselor:', error)
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    )
  }
}

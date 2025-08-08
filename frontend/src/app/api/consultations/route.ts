import { NextResponse } from 'next/server'
import { createClient } from '@libsql/client'

export async function GET() {
  try {
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

    const result = await client.execute('SELECT * FROM consultations ORDER BY appointment_date DESC')
    return NextResponse.json({
      consultations: result.rows,
      count: result.rows.length
    })
  } catch (error) {
    console.error('Error fetching consultations:', error)
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    )
  }
}

export async function POST(request: Request) {
  try {
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
    
    // 상담 예약 생성 로직
    const { user_id, counselor_id, appointment_date, duration, notes } = body
    
    const result = await client.execute({
      sql: `INSERT INTO consultations (user_id, counselor_id, appointment_date, duration, status, notes) 
             VALUES (?, ?, ?, ?, 'pending', ?)`,
      args: [user_id, counselor_id, appointment_date, duration || 60, notes]
    })
    
    return NextResponse.json({
      message: '상담 예약이 성공적으로 등록되었습니다.',
      id: result.lastInsertRowid
    })
  } catch (error) {
    console.error('Error creating consultation:', error)
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    )
  }
}

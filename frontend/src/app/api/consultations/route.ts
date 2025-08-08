import { NextResponse } from 'next/server'
import { createClient } from '@libsql/client'

const client = createClient({
  url: process.env.DATABASE_URL!,
  authToken: process.env.DATABASE_AUTH_TOKEN,
})

export async function GET() {
  try {
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
      id: result.lastInsertId
    })
  } catch (error) {
    console.error('Error creating consultation:', error)
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    )
  }
}

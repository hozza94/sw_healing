import { NextResponse } from 'next/server'
import { createClient } from '@libsql/client'

const client = createClient({
  url: process.env.DATABASE_URL!,
  authToken: process.env.DATABASE_AUTH_TOKEN,
})

export async function GET() {
  try {
    const result = await client.execute('SELECT * FROM counselors WHERE is_active = true')
    return NextResponse.json({
      counselors: result.rows,
      count: result.rows.length
    })
  } catch (error) {
    console.error('Error fetching counselors:', error)
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    )
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json()
    
    // 상담사 생성 로직
    const { name, email, phone, specialization, education, experience, certification, bio } = body
    
    const result = await client.execute({
      sql: `INSERT INTO counselors (name, email, phone, specialization, education, experience, certification, bio, is_online, is_active, rating, total_reviews) 
             VALUES (?, ?, ?, ?, ?, ?, ?, ?, true, true, 0.0, 0)`,
      args: [name, email, phone, specialization, education, experience, certification, bio]
    })
    
    return NextResponse.json({
      message: '상담사가 성공적으로 등록되었습니다.',
      id: result.lastInsertId
    })
  } catch (error) {
    console.error('Error creating counselor:', error)
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    )
  }
}

import { NextResponse } from 'next/server'
import { createClient } from '@libsql/client'

const client = createClient({
  url: process.env.DATABASE_URL!,
  authToken: process.env.DATABASE_AUTH_TOKEN,
})

export async function GET() {
  try {
    const result = await client.execute('SELECT * FROM reviews ORDER BY created_at DESC')
    return NextResponse.json({
      reviews: result.rows,
      count: result.rows.length
    })
  } catch (error) {
    console.error('Error fetching reviews:', error)
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    )
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json()
    
    // 리뷰 생성 로직
    const { user_id, counselor_id, rating, comment } = body
    
    const result = await client.execute({
      sql: `INSERT INTO reviews (user_id, counselor_id, rating, comment) 
             VALUES (?, ?, ?, ?)`,
      args: [user_id, counselor_id, rating, comment]
    })
    
    // 상담사의 평점 업데이트
    await client.execute({
      sql: `UPDATE counselors 
             SET rating = (SELECT AVG(rating) FROM reviews WHERE counselor_id = ?),
                 total_reviews = (SELECT COUNT(*) FROM reviews WHERE counselor_id = ?)
             WHERE id = ?`,
      args: [counselor_id, counselor_id, counselor_id]
    })
    
    return NextResponse.json({
      message: '리뷰가 성공적으로 등록되었습니다.',
      id: result.lastInsertRowid
    })
  } catch (error) {
    console.error('Error creating review:', error)
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    )
  }
}

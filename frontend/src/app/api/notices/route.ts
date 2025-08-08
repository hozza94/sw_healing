import { NextResponse } from 'next/server'
import { createClient } from '@libsql/client'

const client = createClient({
  url: process.env.DATABASE_URL!,
  authToken: process.env.DATABASE_AUTH_TOKEN,
})

export async function GET() {
  try {
    const result = await client.execute('SELECT * FROM notices WHERE is_published = true ORDER BY created_at DESC')
    return NextResponse.json({
      notices: result.rows,
      count: result.rows.length
    })
  } catch (error) {
    console.error('Error fetching notices:', error)
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    )
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json()
    
    // 공지사항 생성 로직
    const { title, content, author } = body
    
    const result = await client.execute({
      sql: `INSERT INTO notices (title, content, author, is_published) 
             VALUES (?, ?, ?, true)`,
      args: [title, content, author]
    })
    
    return NextResponse.json({
      message: '공지사항이 성공적으로 등록되었습니다.',
      id: result.lastInsertRowid
    })
  } catch (error) {
    console.error('Error creating notice:', error)
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    )
  }
}

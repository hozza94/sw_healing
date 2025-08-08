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
    
    // 공지사항 생성 로직
    const { title, content, author } = body
    
    // 데이터 타입 안전하게 변환
    const safeArgs = [
      title ? String(title) : '',
      content ? String(content) : '',
      author ? String(author) : '관리자'
    ]
    
    console.log('전송할 데이터:', safeArgs)
    
    const result = await client.execute({
      sql: `INSERT INTO notices (title, content, author, is_published) 
             VALUES (?, ?, ?, true)`,
      args: safeArgs
    })
    
    return NextResponse.json({
      message: '공지사항이 성공적으로 등록되었습니다.',
      id: Number(result.lastInsertRowid)
    })
  } catch (error) {
    console.error('Error creating notice:', error)
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    )
  }
}

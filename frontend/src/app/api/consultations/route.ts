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
    console.log('POST /api/consultations - 시작')
    
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
    console.log('받은 데이터:', body)
    
    // 상담 예약 생성 로직
    const { 
      user_id, 
      counselor_id, 
      appointment_date, 
      scheduled_at,  // scheduled_at도 지원
      duration, 
      notes,
      description,
      consultation_type,
      urgency_level
    } = body
    
    // 필수 필드 검증
    if (!counselor_id) {
      return NextResponse.json(
        { error: '상담사 ID는 필수입니다.' },
        { status: 400 }
      )
    }
    
    // 날짜 처리 (appointment_date 또는 scheduled_at 사용)
    const appointmentDate = appointment_date || scheduled_at || new Date().toISOString()
    
    // 데이터 타입 안전하게 변환
    const safeArgs = [
      user_id ? Number(user_id) : 1, // 기본 사용자 ID
      Number(counselor_id),
      appointmentDate ? String(appointmentDate) : new Date().toISOString(),
      notes || description || '', // notes 또는 description 사용
      consultation_type || 'INDIVIDUAL',
      urgency_level || 'MEDIUM'
    ]
    
    console.log('전송할 데이터:', safeArgs)
    
    const result = await client.execute({
      sql: `INSERT INTO consultations (user_id, counselor_id, preferred_date, notes, consultation_type, urgency_level, status) 
             VALUES (?, ?, ?, ?, ?, ?, 'pending')`,
      args: safeArgs
    })
    
    return NextResponse.json({
      message: '상담 예약이 성공적으로 등록되었습니다.',
      id: Number(result.lastInsertRowid)
    })
  } catch (error) {
    console.error('Error creating consultation:', error)
    return NextResponse.json(
      { 
        error: 'Internal Server Error',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    )
  }
}

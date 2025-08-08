import { NextResponse } from 'next/server'

export async function GET() {
  return NextResponse.json({ 
    status: "healthy",
    message: "수원 힐링 상담센터 API",
    version: "1.0.0"
  })
}

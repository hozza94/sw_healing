#!/usr/bin/env python3
"""
상담 신청 데이터 확인 스크립트
"""
import sqlite3
import os

def check_consultations():
    """상담 신청 데이터 확인"""
    db_path = "suwon_healing.db"
    
    print("🔍 상담 신청 데이터 확인")
    
    if not os.path.exists(db_path):
        print("❌ 데이터베이스 파일이 존재하지 않습니다.")
        return
    
    try:
        conn = sqlite3.connect(db_path)
        cursor = conn.cursor()
        
        # consultations 테이블 확인
        cursor.execute("SELECT COUNT(*) FROM consultations;")
        count = cursor.fetchone()[0]
        print(f"📊 상담 신청 개수: {count}")
        
        if count > 0:
            print("\n📋 최근 상담 신청 목록:")
            cursor.execute("""
                SELECT id, title, consultation_type, status, contact_name, contact_email, created_at 
                FROM consultations 
                ORDER BY created_at DESC 
                LIMIT 10;
            """)
            
            rows = cursor.fetchall()
            for row in rows:
                print(f"  ID: {row[0]}")
                print(f"    제목: {row[1]}")
                print(f"    유형: {row[2]}")
                print(f"    상태: {row[3]}")
                print(f"    신청자: {row[4]} ({row[5]})")
                print(f"    신청일: {row[6]}")
                print("  ---")
        
        conn.close()
        print("\n✅ 확인 완료!")
        
    except Exception as e:
        print(f"❌ 확인 실패: {e}")

if __name__ == "__main__":
    check_consultations()

#!/usr/bin/env python3
"""
SQLite 데이터베이스 확인 스크립트
"""
import sqlite3
import os
from pathlib import Path

def check_database():
    """데이터베이스 상태 확인"""
    db_path = "suwon_healing.db"
    
    print("🔍 SQLite 데이터베이스 확인")
    print(f"📁 데이터베이스 경로: {os.path.abspath(db_path)}")
    
    # 데이터베이스 파일 존재 확인
    if os.path.exists(db_path):
        print(f"✅ 데이터베이스 파일 존재: {os.path.getsize(db_path)} bytes")
    else:
        print("❌ 데이터베이스 파일이 존재하지 않습니다.")
        return
    
    # 데이터베이스 연결
    try:
        conn = sqlite3.connect(db_path)
        cursor = conn.cursor()
        
        # 테이블 목록 확인
        cursor.execute("SELECT name FROM sqlite_master WHERE type='table';")
        tables = cursor.fetchall()
        
        print(f"\n📋 테이블 목록 ({len(tables)}개):")
        for table in tables:
            print(f"  - {table[0]}")
        
        # 각 테이블의 데이터 확인
        for table in tables:
            table_name = table[0]
            print(f"\n📊 테이블: {table_name}")
            
            # 테이블 구조 확인
            cursor.execute(f"PRAGMA table_info({table_name});")
            columns = cursor.fetchall()
            print("  컬럼:")
            for col in columns:
                print(f"    - {col[1]} ({col[2]})")
            
            # 데이터 개수 확인
            cursor.execute(f"SELECT COUNT(*) FROM {table_name};")
            count = cursor.fetchone()[0]
            print(f"  데이터 개수: {count}")
            
            # 샘플 데이터 확인 (최대 5개)
            if count > 0:
                cursor.execute(f"SELECT * FROM {table_name} LIMIT 5;")
                rows = cursor.fetchall()
                print("  샘플 데이터:")
                for i, row in enumerate(rows, 1):
                    print(f"    {i}. {row}")
        
        conn.close()
        print("\n✅ 데이터베이스 확인 완료!")
        
    except Exception as e:
        print(f"❌ 데이터베이스 확인 실패: {e}")

if __name__ == "__main__":
    check_database() 
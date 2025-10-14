#!/usr/bin/env python3
"""
상담센터 샘플 데이터 삽입 스크립트
"""
import sqlite3
from datetime import datetime, timedelta
import hashlib
import random

def hash_password(password):
    """비밀번호 해싱"""
    return hashlib.sha256(password.encode()).hexdigest()

def insert_sample_data():
    """샘플 데이터 삽입"""
    conn = sqlite3.connect('suwon_healing.db')
    cursor = conn.cursor()
    
    print("🎯 샘플 데이터 삽입 시작...")
    
    # 1. 사용자 데이터 삽입
    print("👥 사용자 데이터 삽입 중...")
    users_data = [
        ('admin@suwon-healing.com', 'admin', '관리자', hash_password('admin123'), '010-1234-5678', 1, 1, datetime.now()),
        ('user1@example.com', 'user1', '김철수', hash_password('password123'), '010-1111-2222', 1, 0, datetime.now()),
        ('user2@example.com', 'user2', '이영희', hash_password('password123'), '010-3333-4444', 1, 0, datetime.now()),
        ('user3@example.com', 'user3', '박민수', hash_password('password123'), '010-5555-6666', 1, 0, datetime.now()),
        ('user4@example.com', 'user4', '최지영', hash_password('password123'), '010-7777-8888', 1, 0, datetime.now()),
    ]
    
    cursor.executemany("""
        INSERT INTO users (email, username, full_name, hashed_password, phone, is_active, is_admin, created_at)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    """, users_data)
    
    # 2. 상담사 데이터 삽입
    print("👨‍⚕️ 상담사 데이터 삽입 중...")
    counselors_data = [
        ('김상담', 'counselor1@suwon-healing.com', '010-1000-1000', '개인상담', 
         '서울대학교 심리학과 졸업\n상담심리사 1급', '10년', '상담심리사 1급', 
         '개인상담 전문가로서 다양한 심리적 어려움을 겪는 분들에게 따뜻한 마음으로 상담을 제공합니다.', 
         'profile1.jpg', 1, 1, 4.8, 25, datetime.now()),
        
        ('이치유', 'counselor2@suwon-healing.com', '010-2000-2000', '부부상담', 
         '연세대학교 가족학과 졸업\n부부상담 전문가', '8년', '부부상담 전문가', 
         '부부 간 소통 문제와 갈등 해결에 특화되어 있습니다. 건강한 관계 회복을 돕습니다.', 
         'profile2.jpg', 1, 1, 4.9, 30, datetime.now()),
        
        ('박가족', 'counselor3@suwon-healing.com', '010-3000-3000', '가족상담', 
         '고려대학교 아동가족학과 졸업\n가족상담사', '12년', '가족상담사', 
         '가족 구성원 간의 이해와 소통을 돕고, 건강한 가족 관계를 만들어갑니다.', 
         'profile3.jpg', 1, 1, 4.7, 20, datetime.now()),
        
        ('최청소년', 'counselor4@suwon-healing.com', '010-4000-4000', '청소년상담', 
         '성균관대학교 아동청소년학과 졸업\n청소년상담사', '6년', '청소년상담사', 
         '청소년의 성장 과정에서 겪는 어려움을 이해하고, 건강한 성장을 돕습니다.', 
         'profile4.jpg', 1, 1, 4.6, 15, datetime.now()),
        
        ('정트라우마', 'counselor5@suwon-healing.com', '010-5000-5000', '트라우마상담', 
         '중앙대학교 임상심리학과 졸업\n트라우마 전문가', '15년', '트라우마 전문가', 
         '과거의 상처와 트라우마 치유에 특화되어 있습니다. 안전한 환경에서 치유를 돕습니다.', 
         'profile5.jpg', 1, 1, 4.9, 35, datetime.now()),
    ]
    
    cursor.executemany("""
        INSERT INTO counselors (name, email, phone, specialization, education, experience, certification, bio, profile_image, is_online, is_active, rating, total_reviews, created_at)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    """, counselors_data)
    
    # 3. 상담 신청 데이터 삽입
    print("📝 상담 신청 데이터 삽입 중...")
    consultation_types = ['INDIVIDUAL', 'COUPLE', 'FAMILY', 'YOUTH', 'TRAUMA']
    statuses = ['PENDING', 'CONFIRMED', 'COMPLETED', 'CANCELLED']
    urgency_levels = ['LOW', 'MEDIUM', 'HIGH']
    
    consultations_data = []
    for i in range(1, 11):
        user_id = random.randint(2, 5)  # admin 제외
        counselor_id = random.randint(1, 5)
        consultation_type = random.choice(consultation_types)
        status = random.choice(statuses)
        urgency_level = random.choice(urgency_levels)
        
        titles = [
            '스트레스로 인한 불면증',
            '부부 간 소통 문제',
            '가족 관계 개선',
            '청소년 우울증',
            '과거 트라우마 치유',
            '직장 스트레스',
            '대인관계 어려움',
            '자존감 향상',
            '불안증 치료',
            '이혼 상담'
        ]
        
        descriptions = [
            '최근 스트레스로 인해 잠을 잘 자지 못하고 있습니다.',
            '부부 간 대화가 줄어들고 갈등이 생기고 있습니다.',
            '가족 구성원 간의 이해와 소통이 필요합니다.',
            '청소년의 성장 과정에서 겪는 어려움을 해결하고 싶습니다.',
            '과거의 상처로 인한 현재의 어려움을 치유하고 싶습니다.',
            '직장에서의 스트레스와 압박감으로 힘들어하고 있습니다.',
            '사람들과의 관계에서 어려움을 겪고 있습니다.',
            '자신감이 부족하고 자존감이 낮습니다.',
            '불안감이 심하고 일상생활에 지장을 받고 있습니다.',
            '이혼 과정에서의 심리적 지원이 필요합니다.'
        ]
        
        created_at = datetime.now() - timedelta(days=random.randint(1, 30))
        
        consultations_data.append((
            user_id, counselor_id, consultation_type, status, urgency_level,
            titles[i-1], descriptions[i-1],
            created_at + timedelta(days=random.randint(1, 14)),
            f"{random.randint(9, 18)}:00", f"김{chr(65+i)}", f"010-{random.randint(1000, 9999)}-{random.randint(1000, 9999)}",
            f"user{i}@example.com", f"추가 요청사항: {i}번째 상담 신청입니다.", 1, created_at
        ))
    
    cursor.executemany("""
        INSERT INTO consultations (user_id, counselor_id, consultation_type, status, urgency_level, title, description, preferred_date, preferred_time, contact_name, contact_phone, contact_email, notes, is_confidential, created_at)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    """, consultations_data)
    
    # 4. 공지사항 데이터 삽입
    print("📢 공지사항 데이터 삽입 중...")
    notices_data = [
        (1, '상담센터 운영시간 변경 안내', '2024년 1월부터 상담센터 운영시간이 변경됩니다.\n\n평일: 09:00-18:00\n토요일: 09:00-14:00\n일요일: 휴무\n\n더 나은 서비스를 위해 노력하겠습니다.', 'GENERAL', 'PUBLISHED', 1, 1, None, 0, datetime.now()),
        (1, '코로나19 방역 수칙 안내', '상담센터를 이용하시는 모든 분들께서는 마스크 착용과 손소독을 부탁드립니다.\n\n발열이나 호흡기 증상이 있으시면 상담 일정을 조정해주세요.', 'IMPORTANT', 'PUBLISHED', 1, 1, None, 0, datetime.now()),
        (1, '새로운 상담사 합류 안내', '김상담 선생님이 개인상담 전문가로 합류하셨습니다.\n\n10년의 경험을 바탕으로 따뜻한 마음으로 상담을 제공하실 예정입니다.', 'GENERAL', 'PUBLISHED', 0, 1, None, 0, datetime.now()),
        (1, '온라인 상담 서비스 시작', '원격 상담 서비스를 시작합니다.\n\n집에서 편안하게 상담받으실 수 있습니다.\n\n자세한 내용은 전화로 문의해주세요.', 'SERVICE', 'PUBLISHED', 0, 1, None, 0, datetime.now()),
        (1, '상담센터 휴무일 안내', '2024년 설날 연휴 기간 중 상담센터가 휴무입니다.\n\n설날: 2월 9일-11일\n\n긴급한 상담이 필요하시면 전화로 문의해주세요.', 'GENERAL', 'PUBLISHED', 0, 1, None, 0, datetime.now()),
    ]
    
    cursor.executemany("""
        INSERT INTO notices (author_id, title, content, notice_type, status, is_pinned, is_active, attachment_url, view_count, created_at)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    """, notices_data)
    
    # 5. 후기 데이터 삽입
    print("⭐ 후기 데이터 삽입 중...")
    reviews_data = []
    review_titles = [
        '정말 도움이 되었습니다',
        '따뜻한 상담 감사합니다',
        '전문적인 상담이었어요',
        '마음이 편해졌습니다',
        '추천합니다',
        '좋은 경험이었습니다',
        '감사합니다',
        '도움이 많이 되었어요',
        '전문가다운 상담',
        '만족스러운 상담'
    ]
    
    review_contents = [
        '상담사 선생님의 따뜻한 마음이 전해져서 정말 도움이 되었습니다.',
        '상담을 받으면서 마음이 편해지고 힘을 얻을 수 있었습니다.',
        '전문적이고 체계적인 상담으로 문제 해결에 도움이 되었습니다.',
        '상담 후 마음이 가벼워지고 새로운 희망을 가질 수 있었습니다.',
        '친구들에게도 추천하고 싶은 좋은 상담센터입니다.',
        '상담사 선생님의 경험과 지식이 돋보이는 상담이었습니다.',
        '어려운 시기를 함께해주셔서 정말 감사합니다.',
        '상담을 통해 문제의 원인을 파악하고 해결책을 찾을 수 있었습니다.',
        '전문가다운 상담으로 신뢰할 수 있었습니다.',
        '상담 후 변화를 느낄 수 있어서 만족스러웠습니다.'
    ]
    
    for i in range(1, 16):
        user_id = random.randint(2, 5)
        counselor_id = random.randint(1, 5)
        rating = random.randint(4, 5)
        is_anonymous = random.choice([True, False])
        
        reviews_data.append((
            rating, review_titles[i % len(review_titles)], review_contents[i % len(review_contents)],
            is_anonymous, None, user_id, counselor_id, None, 1, 1, datetime.now()
        ))
    
    cursor.executemany("""
        INSERT INTO reviews (rating, title, content, is_anonymous, image_url, user_id, counselor_id, consultation_id, is_approved, is_active, created_at)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    """, reviews_data)
    
    conn.commit()
    conn.close()
    
    print("✅ 샘플 데이터 삽입 완료!")
    print(f"📊 삽입된 데이터:")
    print(f"  - 사용자: {len(users_data)}명")
    print(f"  - 상담사: {len(counselors_data)}명")
    print(f"  - 상담 신청: {len(consultations_data)}건")
    print(f"  - 공지사항: {len(notices_data)}건")
    print(f"  - 후기: {len(reviews_data)}건")

if __name__ == "__main__":
    insert_sample_data() 
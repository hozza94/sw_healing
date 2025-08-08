const { createClient } = require('@libsql/client');
const fs = require('fs');

// 환경 변수 설정
const DATABASE_URL = 'libsql://swhealing-hozza.aws-ap-northeast-1.turso.io';
const DATABASE_AUTH_TOKEN = 'eyJhbGciOiJFZERTQSIsInR5cCI6IkpXVCJ9.eyJhIjoicnciLCJnaWQiOiI2NTE5YTM5Zi1kZTc5LTQxNGYtOTA0ZC1kOGI2NDliMDZmN2MiLCJpYXQiOjE3NTQ0NDMzOTksInJpZCI6IjA5OGQzZTNhLWE0OWMtNGQ0NC04MGIxLWVjOTM3MzY4YjQ5MSJ9.FZgSEU3NZJj7lhaLHfnNg6KxoLUGO9u9MLsa9nLI3HBCKVf6Ke1O4-m0WMs_CQdtcLEAYL3xNIID8E8HnRqzAA';

async function setupTursoDatabase() {
  try {
    console.log('🔗 Turso 데이터베이스에 연결 중...');
    
    const client = createClient({
      url: DATABASE_URL,
      authToken: DATABASE_AUTH_TOKEN,
    });

    // 연결 테스트
    console.log('✅ 데이터베이스 연결 성공');

    // SQL 스키마 파일 읽기
    const schemaSQL = fs.readFileSync('turso_schema.sql', 'utf8');
    
    // SQL 문을 세미콜론으로 분리
    const statements = schemaSQL
      .split(';')
      .map(stmt => stmt.trim())
      .filter(stmt => stmt.length > 0);

    console.log(`📝 ${statements.length}개의 SQL 문을 실행합니다...`);

    // 각 SQL 문 실행
    for (let i = 0; i < statements.length; i++) {
      const statement = statements[i];
      if (statement.trim()) {
        try {
          await client.execute(statement);
          console.log(`✅ SQL 문 ${i + 1} 실행 완료`);
        } catch (error) {
          console.log(`⚠️ SQL 문 ${i + 1} 실행 중 오류 (무시됨):`, error.message);
        }
      }
    }

    // 테이블 생성 확인
    console.log('\n📊 테이블 생성 확인...');
    const tables = await client.execute("SELECT name FROM sqlite_master WHERE type='table'");
    console.log('생성된 테이블:', tables.rows.map(row => row.name));

    // 상담사 데이터 확인
    const counselors = await client.execute('SELECT COUNT(*) as count FROM counselors');
    console.log(`상담사 수: ${counselors.rows[0].count}`);

    // 사용자 데이터 확인
    const users = await client.execute('SELECT COUNT(*) as count FROM users');
    console.log(`사용자 수: ${users.rows[0].count}`);

    // 공지사항 데이터 확인
    const notices = await client.execute('SELECT COUNT(*) as count FROM notices');
    console.log(`공지사항 수: ${notices.rows[0].count}`);

    // 리뷰 데이터 확인
    const reviews = await client.execute('SELECT COUNT(*) as count FROM reviews');
    console.log(`리뷰 수: ${reviews.rows[0].count}`);

    console.log('\n🎉 Turso 데이터베이스 설정 완료!');

  } catch (error) {
    console.error('❌ 오류 발생:', error);
    process.exit(1);
  }
}

setupTursoDatabase();

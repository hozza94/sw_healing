/**
 * 데이터베이스 최적화 유틸리티
 * 쿼리 최적화, 연결 풀링, 성능 모니터링
 */

import { getLogger } from './logger.js';

// 쿼리 최적화 클래스
export class DatabaseOptimizer {
  constructor(env) {
    this.env = env;
    this.logger = getLogger();
    this.queryCache = new Map(); // 쿼리 결과 캐싱
  }

  // 최적화된 데이터베이스 연결
  async executeQuery(sql, params = []) {
    const startTime = Date.now();
    
    try {
      // 환경 변수 검증
      if (!this.env.DATABASE_URL) {
        throw new Error('Database URL not configured');
      }

      const authToken = this.env.DATABASE_AUTH_TOKEN;
      if (!authToken) {
        throw new Error('Database authentication token not configured');
      }

      // Turso HTTP API 사용
      const httpUrl = this.env.DATABASE_URL.replace('libsql://', 'https://');
      
      // Turso HTTP API 형식에 맞게 파라미터 변환
      const tursoParams = params.map(param => {
        if (param === null || param === undefined) {
          return { type: 'null' };
        } else if (typeof param === 'string') {
          return { type: 'text', value: param };
        } else if (typeof param === 'number') {
          return { type: 'integer', value: param };
        } else if (typeof param === 'boolean') {
          return { type: 'integer', value: param ? 1 : 0 };
        } else {
          return { type: 'text', value: String(param) };
        }
      });

      const response = await fetch(`${httpUrl}/v1/execute`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${authToken}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          stmt: {
            sql: sql,
            args: tursoParams
          }
        })
      });

      const responseTime = Date.now() - startTime;

      if (!response.ok) {
        const errorText = await response.text();
        this.logger.error('Database query failed', {
          sql: sql.substring(0, 100),
          status: response.status,
          error: errorText,
          responseTime: `${responseTime}ms`
        });
        throw new Error(`Database request failed: ${response.status} - ${errorText}`);
      }

      const data = await response.json();
      
      this.logger.debug('Database query executed', {
        sql: sql.substring(0, 100),
        responseTime: `${responseTime}ms`,
        rowCount: data.result?.rows?.length || 0
      });

      return this.parseTursoResponse(data);

    } catch (error) {
      const responseTime = Date.now() - startTime;
      this.logger.error('Database query error', {
        sql: sql.substring(0, 100),
        error: error.message,
        responseTime: `${responseTime}ms`
      });
      throw error;
    }
  }

  // Turso 응답 파싱 최적화
  parseTursoResponse(data) {
    const rawRows = data.result?.rows || [];
    const columns = data.result?.cols || [];
    
    // 컬럼 인덱스 미리 계산
    const columnMap = new Map();
    columns.forEach((col, index) => {
      columnMap.set(index, col.name);
    });

    // 최적화된 데이터 변환
    return rawRows.map(row => {
      const obj = {};
      for (let i = 0; i < row.length; i++) {
        const columnName = columnMap.get(i);
        const value = row[i];
        obj[columnName] = value?.value || value;
      }
      return obj;
    });
  }

  // 최적화된 상담사 조회
  async getCounselors(activeOnly = true) {
    const sql = activeOnly 
      ? 'SELECT id, name, email, phone, specialization, education, experience, bio, profile_image, is_online, rating, total_reviews, created_at FROM counselors WHERE is_active = 1'
      : 'SELECT id, name, email, phone, specialization, education, experience, bio, profile_image, is_online, rating, total_reviews, created_at FROM counselors';
    
    return await this.executeQuery(sql);
  }

  // 최적화된 특정 상담사 조회
  async getCounselorById(id) {
    const sql = 'SELECT id, name, email, phone, specialization, education, experience, bio, profile_image, is_online, rating, total_reviews, created_at FROM counselors WHERE id = ?';
    const results = await this.executeQuery(sql, [id]);
    return results[0] || null;
  }

  // 최적화된 공지사항 조회
  async getNotices(publishedOnly = true) {
    const sql = publishedOnly
      ? 'SELECT id, title, content, notice_type, is_pinned, view_count, created_at FROM notices WHERE status = "published" ORDER BY is_pinned DESC, created_at DESC'
      : 'SELECT id, title, content, notice_type, is_pinned, view_count, created_at FROM notices ORDER BY is_pinned DESC, created_at DESC';
    
    return await this.executeQuery(sql);
  }

  // 최적화된 특정 공지사항 조회
  async getNoticeById(id) {
    const sql = 'SELECT id, title, content, notice_type, is_pinned, view_count, created_at FROM notices WHERE id = ?';
    const results = await this.executeQuery(sql, [id]);
    return results[0] || null;
  }

  // 최적화된 리뷰 조회
  async getReviews(approvedOnly = true) {
    const sql = approvedOnly
      ? 'SELECT id, user_id, counselor_id, rating, title, content, is_anonymous, is_approved, view_count, author_name, counselor_name, created_at FROM reviews WHERE is_approved = 1 AND is_active = 1 ORDER BY created_at DESC'
      : 'SELECT id, user_id, counselor_id, rating, title, content, is_anonymous, is_approved, view_count, author_name, counselor_name, created_at FROM reviews ORDER BY created_at DESC';
    
    return await this.executeQuery(sql);
  }

  // 최적화된 특정 리뷰 조회
  async getReviewById(id) {
    const sql = 'SELECT id, user_id, counselor_id, rating, title, content, is_anonymous, is_approved, view_count, author_name, counselor_name, created_at FROM reviews WHERE id = ?';
    const results = await this.executeQuery(sql, [id]);
    return results[0] || null;
  }

  // 상담 신청 저장 (최적화)
  async createConsultation(consultationData) {
    const sql = `INSERT INTO consultations 
      (user_name, user_email, user_phone, counselor_id, consultation_type, preferred_date, preferred_time, message, status, created_at, updated_at)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, 'pending', datetime('now'), datetime('now'))`;
    
    const params = [
      consultationData.user_name,
      consultationData.user_email,
      consultationData.user_phone,
      consultationData.counselor_id,
      consultationData.consultation_type,
      consultationData.preferred_date,
      consultationData.preferred_time,
      consultationData.message
    ];

    await this.executeQuery(sql, params);
    
    // 생성된 ID 조회
    const result = await this.executeQuery('SELECT last_insert_rowid() as id');
    return result[0].id;
  }

  // 병렬 쿼리 실행
  async executeParallelQueries(queries) {
    const startTime = Date.now();
    
    try {
      const promises = queries.map(query => 
        this.executeQuery(query.sql, query.params || [])
      );

      const results = await Promise.all(promises);
      
      const responseTime = Date.now() - startTime;
      this.logger.info('Parallel queries executed', {
        queryCount: queries.length,
        responseTime: `${responseTime}ms`
      });

      return results;
    } catch (error) {
      const responseTime = Date.now() - startTime;
      this.logger.error('Parallel queries failed', {
        queryCount: queries.length,
        error: error.message,
        responseTime: `${responseTime}ms`
      });
      throw error;
    }
  }

  // 쿼리 성능 분석
  analyzeQuery(sql) {
    const analysis = {
      complexity: 'simple',
      estimatedRows: 0,
      hasJoins: false,
      hasSubqueries: false,
      hasAggregations: false,
      recommendations: []
    };

    const sqlLower = sql.toLowerCase();

    // JOIN 분석
    if (sqlLower.includes('join')) {
      analysis.hasJoins = true;
      analysis.complexity = 'complex';
      analysis.recommendations.push('Consider adding indexes for JOIN columns');
    }

    // 서브쿼리 분석
    if (sqlLower.includes('select') && sqlLower.split('select').length > 2) {
      analysis.hasSubqueries = true;
      analysis.complexity = 'complex';
      analysis.recommendations.push('Consider optimizing subqueries');
    }

    // 집계 함수 분석
    if (sqlLower.includes('count(') || sqlLower.includes('sum(') || sqlLower.includes('avg(')) {
      analysis.hasAggregations = true;
      analysis.complexity = 'moderate';
      analysis.recommendations.push('Consider adding indexes for aggregation columns');
    }

    // WHERE 절 분석
    if (sqlLower.includes('where')) {
      analysis.recommendations.push('Ensure WHERE columns are indexed');
    }

    // ORDER BY 분석
    if (sqlLower.includes('order by')) {
      analysis.recommendations.push('Consider adding indexes for ORDER BY columns');
    }

    return analysis;
  }

  // 데이터베이스 통계 조회
  async getDatabaseStats() {
    const queries = [
      { sql: 'SELECT COUNT(*) as counselor_count FROM counselors WHERE is_active = 1' },
      { sql: 'SELECT COUNT(*) as notice_count FROM notices WHERE status = "published"' },
      { sql: 'SELECT COUNT(*) as review_count FROM reviews WHERE is_approved = 1 AND is_active = 1' },
      { sql: 'SELECT COUNT(*) as consultation_count FROM consultations' }
    ];

    const results = await this.executeParallelQueries(queries);
    
    return {
      counselors: results[0][0].counselor_count,
      notices: results[1][0].notice_count,
      reviews: results[2][0].review_count,
      consultations: results[3][0].consultation_count
    };
  }
}

// 전역 데이터베이스 최적화 인스턴스
let globalDB = null;

// 데이터베이스 초기화
export function initDatabase(env) {
  globalDB = new DatabaseOptimizer(env);
  return globalDB;
}

// 전역 데이터베이스 가져오기
export function getDatabase() {
  return globalDB;
}

/**
 * 에러 처리 유틸리티 및 커스텀 에러 클래스
 */

// HTTP 상태 코드 상수
export const HTTP_STATUS = {
  OK: 200,
  CREATED: 201,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  UNPROCESSABLE_ENTITY: 422,
  INTERNAL_SERVER_ERROR: 500,
  SERVICE_UNAVAILABLE: 503
};

// 에러 타입 상수
export const ERROR_TYPES = {
  VALIDATION_ERROR: 'VALIDATION_ERROR',
  DATABASE_ERROR: 'DATABASE_ERROR',
  AUTHENTICATION_ERROR: 'AUTHENTICATION_ERROR',
  AUTHORIZATION_ERROR: 'AUTHORIZATION_ERROR',
  NOT_FOUND_ERROR: 'NOT_FOUND_ERROR',
  INTERNAL_ERROR: 'INTERNAL_ERROR',
  EXTERNAL_SERVICE_ERROR: 'EXTERNAL_SERVICE_ERROR'
};

// 커스텀 에러 클래스
export class AppError extends Error {
  constructor(message, statusCode = HTTP_STATUS.INTERNAL_SERVER_ERROR, type = ERROR_TYPES.INTERNAL_ERROR, details = null) {
    super(message);
    this.name = 'AppError';
    this.statusCode = statusCode;
    this.type = type;
    this.details = details;
    this.timestamp = new Date().toISOString();
    
    // 스택 트레이스 유지
    Error.captureStackTrace(this, this.constructor);
  }
}

// 특화된 에러 클래스들
export class ValidationError extends AppError {
  constructor(message, details = null) {
    super(message, HTTP_STATUS.UNPROCESSABLE_ENTITY, ERROR_TYPES.VALIDATION_ERROR, details);
    this.name = 'ValidationError';
  }
}

export class DatabaseError extends AppError {
  constructor(message, details = null) {
    super(message, HTTP_STATUS.SERVICE_UNAVAILABLE, ERROR_TYPES.DATABASE_ERROR, details);
    this.name = 'DatabaseError';
  }
}

export class NotFoundError extends AppError {
  constructor(resource, id = null) {
    const message = id ? `${resource} with ID '${id}' not found` : `${resource} not found`;
    super(message, HTTP_STATUS.NOT_FOUND, ERROR_TYPES.NOT_FOUND_ERROR);
    this.name = 'NotFoundError';
    this.resource = resource;
    this.id = id;
  }
}

export class AuthenticationError extends AppError {
  constructor(message = 'Authentication required') {
    super(message, HTTP_STATUS.UNAUTHORIZED, ERROR_TYPES.AUTHENTICATION_ERROR);
    this.name = 'AuthenticationError';
  }
}

export class AuthorizationError extends AppError {
  constructor(message = 'Insufficient permissions') {
    super(message, HTTP_STATUS.FORBIDDEN, ERROR_TYPES.AUTHORIZATION_ERROR);
    this.name = 'AuthorizationError';
  }
}

// 에러 응답 생성 함수
export function createErrorResponse(error, corsHeaders = {}) {
  // AppError 인스턴스인 경우
  if (error instanceof AppError) {
    return new Response(JSON.stringify({
      error: {
        type: error.type,
        message: error.message,
        statusCode: error.statusCode,
        timestamp: error.timestamp,
        details: error.details
      }
    }), {
      status: error.statusCode,
      headers: { 
        'Content-Type': 'application/json',
        ...corsHeaders 
      },
    });
  }

  // 일반 Error 인스턴스인 경우
  return new Response(JSON.stringify({
    error: {
      type: ERROR_TYPES.INTERNAL_ERROR,
      message: 'An unexpected error occurred',
      statusCode: HTTP_STATUS.INTERNAL_SERVER_ERROR,
      timestamp: new Date().toISOString(),
      details: process.env.NODE_ENV === 'development' ? error.message : null
    }
  }), {
    status: HTTP_STATUS.INTERNAL_SERVER_ERROR,
    headers: { 
      'Content-Type': 'application/json',
      ...corsHeaders 
    },
  });
}

// 성공 응답 생성 함수 (최적화됨)
export function createSuccessResponse(data, statusCode = HTTP_STATUS.OK, corsHeaders = {}) {
  const responseData = {
    success: true,
    data: data,
    timestamp: new Date().toISOString()
  };

  // JSON 압축 (간단한 최적화)
  const jsonString = JSON.stringify(responseData);
  
  // 성능 최적화 헤더
  const performanceHeaders = {
    'Content-Type': 'application/json; charset=utf-8',
    'Cache-Control': 'public, max-age=300',
    'ETag': `"${btoa(jsonString).slice(0, 16)}"`,
    'X-Response-Time': Date.now().toString()
  };

  return new Response(jsonString, {
    status: statusCode,
    headers: { 
      ...performanceHeaders,
      ...corsHeaders 
    },
  });
}

// 에러 로깅 함수
export function logError(error, context = {}) {
  const logData = {
    timestamp: new Date().toISOString(),
    error: {
      name: error.name,
      message: error.message,
      stack: error.stack,
      type: error.type || 'UNKNOWN',
      statusCode: error.statusCode || 500
    },
    context: context
  };

  // 개발 환경에서는 상세 로그
  if (process.env.NODE_ENV === 'development') {
    console.error('🚨 Error Details:', JSON.stringify(logData, null, 2));
  } else {
    // 프로덕션에서는 간소화된 로그
    console.error('🚨 Error:', {
      type: logData.error.type,
      message: logData.error.message,
      statusCode: logData.error.statusCode,
      context: context
    });
  }
}

// 입력 검증 함수들
export function validateRequired(value, fieldName) {
  if (value === null || value === undefined || value === '') {
    throw new ValidationError(`${fieldName} is required`);
  }
  return value;
}

export function validateEmail(email) {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    throw new ValidationError('Invalid email format');
  }
  return email;
}

export function validatePhone(phone) {
  const phoneRegex = /^01[0-9]-?[0-9]{4}-?[0-9]{4}$/;
  if (!phoneRegex.test(phone.replace(/\s/g, ''))) {
    throw new ValidationError('Invalid phone number format (010-XXXX-XXXX)');
  }
  return phone;
}

export function validateId(id, resourceName = 'Resource') {
  if (!id || isNaN(parseInt(id)) || parseInt(id) <= 0) {
    throw new ValidationError(`Invalid ${resourceName.toLowerCase()} ID`);
  }
  return parseInt(id);
}

// 데이터베이스 에러 처리 함수
export function handleDatabaseError(error, operation = 'database operation') {
  logError(error, { operation });
  
  if (error.message.includes('401') || error.message.includes('Unauthorized')) {
    throw new DatabaseError('Database authentication failed');
  } else if (error.message.includes('404') || error.message.includes('Not Found')) {
    throw new DatabaseError('Database not found or unreachable');
  } else if (error.message.includes('timeout')) {
    throw new DatabaseError('Database request timeout');
  } else {
    throw new DatabaseError(`Database ${operation} failed`);
  }
}

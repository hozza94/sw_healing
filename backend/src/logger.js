/**
 * 고급 로깅 시스템
 * Cloudflare Workers용 구조화된 로깅
 */

// 로그 레벨 상수
export const LOG_LEVELS = {
  ERROR: 0,
  WARN: 1,
  INFO: 2,
  DEBUG: 3,
  TRACE: 4
};

// 로그 레벨 이름
export const LOG_LEVEL_NAMES = {
  [LOG_LEVELS.ERROR]: 'ERROR',
  [LOG_LEVELS.WARN]: 'WARN',
  [LOG_LEVELS.INFO]: 'INFO',
  [LOG_LEVELS.DEBUG]: 'DEBUG',
  [LOG_LEVELS.TRACE]: 'TRACE'
};

// 환경별 로그 레벨 설정
const getLogLevel = (env) => {
  const level = env.LOG_LEVEL || 'INFO';
  return LOG_LEVELS[level.toUpperCase()] || LOG_LEVELS.INFO;
};

// 로그 포맷터
class LogFormatter {
  static format(level, message, data = {}, context = {}) {
    const timestamp = new Date().toISOString();
    const logEntry = {
      timestamp,
      level: LOG_LEVEL_NAMES[level],
      message,
      data,
      context: {
        ...context,
        worker: 'sw-healing-api',
        version: '1.0.0'
      }
    };

    // 개발 환경에서는 색상 추가
    if (context.env === 'development') {
      return this.formatWithColors(logEntry);
    }

    return JSON.stringify(logEntry);
  }

  static formatWithColors(logEntry) {
    const colors = {
      ERROR: '\x1b[31m', // 빨간색
      WARN: '\x1b[33m',  // 노란색
      INFO: '\x1b[36m',  // 청록색
      DEBUG: '\x1b[35m', // 자주색
      TRACE: '\x1b[37m', // 흰색
      RESET: '\x1b[0m'
    };

    const color = colors[logEntry.level] || colors.RESET;
    const reset = colors.RESET;

    return `${color}[${logEntry.timestamp}] ${logEntry.level}: ${logEntry.message}${reset}\n` +
           `${JSON.stringify(logEntry.data, null, 2)}\n` +
           `Context: ${JSON.stringify(logEntry.context, null, 2)}`;
  }
}

// 메트릭 수집기
class MetricsCollector {
  constructor() {
    this.metrics = {
      requests: 0,
      errors: 0,
      responseTime: [],
      databaseQueries: 0,
      databaseErrors: 0
    };
  }

  incrementRequests() {
    this.metrics.requests++;
  }

  incrementErrors() {
    this.metrics.errors++;
  }

  recordResponseTime(time) {
    this.metrics.responseTime.push(time);
    // 최근 100개만 유지
    if (this.metrics.responseTime.length > 100) {
      this.metrics.responseTime = this.metrics.responseTime.slice(-100);
    }
  }

  incrementDatabaseQueries() {
    this.metrics.databaseQueries++;
  }

  incrementDatabaseErrors() {
    this.metrics.databaseErrors++;
  }

  getMetrics() {
    const avgResponseTime = this.metrics.responseTime.length > 0
      ? this.metrics.responseTime.reduce((a, b) => a + b, 0) / this.metrics.responseTime.length
      : 0;

    return {
      ...this.metrics,
      avgResponseTime: Math.round(avgResponseTime * 100) / 100,
      errorRate: this.metrics.requests > 0 
        ? Math.round((this.metrics.errors / this.metrics.requests) * 100 * 100) / 100
        : 0
    };
  }

  reset() {
    this.metrics = {
      requests: 0,
      errors: 0,
      responseTime: [],
      databaseQueries: 0,
      databaseErrors: 0
    };
  }
}

// 전역 메트릭 수집기
const globalMetrics = new MetricsCollector();

// 로거 클래스
export class Logger {
  constructor(env = {}) {
    this.env = env;
    this.logLevel = getLogLevel(env);
    this.metrics = globalMetrics;
  }

  // 로그 출력 여부 확인
  shouldLog(level) {
    return level <= this.logLevel;
  }

  // 기본 로그 메서드
  log(level, message, data = {}, context = {}) {
    if (!this.shouldLog(level)) return;

    const logContext = {
      ...context,
      env: this.env.ENVIRONMENT || 'production'
    };

    const formattedLog = LogFormatter.format(level, message, data, logContext);
    
    // Cloudflare Workers에서는 console.log 사용
    if (level === LOG_LEVELS.ERROR) {
      console.error(formattedLog);
    } else if (level === LOG_LEVELS.WARN) {
      console.warn(formattedLog);
    } else {
      console.log(formattedLog);
    }
  }

  // 레벨별 로그 메서드
  error(message, data = {}, context = {}) {
    this.log(LOG_LEVELS.ERROR, message, data, context);
    this.metrics.incrementErrors();
  }

  warn(message, data = {}, context = {}) {
    this.log(LOG_LEVELS.WARN, message, data, context);
  }

  info(message, data = {}, context = {}) {
    this.log(LOG_LEVELS.INFO, message, data, context);
  }

  debug(message, data = {}, context = {}) {
    this.log(LOG_LEVELS.DEBUG, message, data, context);
  }

  trace(message, data = {}, context = {}) {
    this.log(LOG_LEVELS.TRACE, message, data, context);
  }

  // 특화된 로그 메서드
  request(method, path, statusCode, responseTime, context = {}) {
    this.info('API Request', {
      method,
      path,
      statusCode,
      responseTime: `${responseTime}ms`
    }, context);
    
    this.metrics.incrementRequests();
    this.metrics.recordResponseTime(responseTime);
  }

  database(operation, query, success = true, responseTime = null, context = {}) {
    if (success) {
      this.debug('Database Operation', {
        operation,
        query: query.substring(0, 100) + (query.length > 100 ? '...' : ''),
        responseTime: responseTime ? `${responseTime}ms` : null
      }, context);
      this.metrics.incrementDatabaseQueries();
    } else {
      this.error('Database Error', {
        operation,
        query: query.substring(0, 100) + (query.length > 100 ? '...' : ''),
        responseTime: responseTime ? `${responseTime}ms` : null
      }, context);
      this.metrics.incrementDatabaseErrors();
    }
  }

  validation(field, value, rule, context = {}) {
    this.debug('Validation', {
      field,
      value: typeof value === 'string' ? value.substring(0, 50) : value,
      rule,
      valid: false
    }, context);
  }

  performance(operation, duration, context = {}) {
    this.info('Performance', {
      operation,
      duration: `${duration}ms`
    }, context);
  }

  // 메트릭 조회
  getMetrics() {
    return this.metrics.getMetrics();
  }

  // 메트릭 리셋
  resetMetrics() {
    this.metrics.reset();
  }
}

// 전역 로거 인스턴스
let globalLogger = null;

// 로거 초기화
export function initLogger(env) {
  globalLogger = new Logger(env);
  return globalLogger;
}

// 전역 로거 가져오기
export function getLogger() {
  if (!globalLogger) {
    globalLogger = new Logger();
  }
  return globalLogger;
}

// 편의 함수들
export function logError(message, data = {}, context = {}) {
  getLogger().error(message, data, context);
}

export function logInfo(message, data = {}, context = {}) {
  getLogger().info(message, data, context);
}

export function logDebug(message, data = {}, context = {}) {
  getLogger().debug(message, data, context);
}

export function logRequest(method, path, statusCode, responseTime, context = {}) {
  getLogger().request(method, path, statusCode, responseTime, context);
}

export function logDatabase(operation, query, success = true, responseTime = null, context = {}) {
  getLogger().database(operation, query, success, responseTime, context);
}

// 성능 측정 데코레이터
export function measurePerformance(operation) {
  return function(target, propertyKey, descriptor) {
    const originalMethod = descriptor.value;
    
    descriptor.value = async function(...args) {
      const start = Date.now();
      try {
        const result = await originalMethod.apply(this, args);
        const duration = Date.now() - start;
        getLogger().performance(operation, duration, { method: propertyKey });
        return result;
      } catch (error) {
        const duration = Date.now() - start;
        getLogger().error(`Performance Error in ${operation}`, {
          method: propertyKey,
          duration: `${duration}ms`,
          error: error.message
        });
        throw error;
      }
    };
    
    return descriptor;
  };
}

// 요청 추적 미들웨어
export function createRequestLogger(logger) {
  return async function(request, env, ctx, next) {
    const start = Date.now();
    const method = request.method;
    const url = new URL(request.url);
    const path = url.pathname;
    
    logger.info('Request Started', {
      method,
      path,
      userAgent: request.headers.get('User-Agent'),
      ip: request.headers.get('CF-Connecting-IP') || 'unknown'
    });

    try {
      const response = await next(request, env, ctx);
      const duration = Date.now() - start;
      
      logger.request(method, path, response.status, duration);
      
      return response;
    } catch (error) {
      const duration = Date.now() - start;
      
      logger.error('Request Failed', {
        method,
        path,
        duration: `${duration}ms`,
        error: error.message
      });
      
      throw error;
    }
  };
}

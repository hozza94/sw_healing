/**
 * 캐싱 시스템
 * Cloudflare KV와 메모리 캐싱을 활용한 다층 캐싱
 */

// 캐시 키 생성 함수
export function generateCacheKey(prefix, ...params) {
  return `${prefix}:${params.join(':')}`;
}

// 캐시 TTL 상수 (초)
export const CACHE_TTL = {
  COUNSELORS: 3600,      // 1시간
  NOTICES: 1800,         // 30분
  REVIEWS: 1800,         // 30분
  CONSULTATIONS: 300,    // 5분
  HEALTH: 60,            // 1분
  METRICS: 30            // 30초
};

// 메모리 캐시 (메모리 최적화됨)
class MemoryCache {
  constructor() {
    this.cache = new Map();
    this.timers = new Map();
    
    // 메모리 최적화 설정
    this.maxSize = 100; // 최대 캐시 항목 수
    this.maxMemoryUsage = 5 * 1024 * 1024; // 5MB 제한
    this.currentMemoryUsage = 0;
    this.cleanupInterval = 300000; // 5분마다 정리
    this.lastCleanup = Date.now();
  }

  set(key, value, ttl = 300) {
    // 메모리 사용량 확인
    if (this.shouldCleanup()) {
      this.cleanup();
    }

    // 기존 타이머 제거
    if (this.timers.has(key)) {
      clearTimeout(this.timers.get(key));
    }

    // 메모리 사용량 계산
    const itemSize = this.calculateItemSize(value);
    
    // 메모리 제한 확인
    if (this.currentMemoryUsage + itemSize > this.maxMemoryUsage) {
      this.aggressiveCleanup();
    }

    // 캐시 저장
    this.cache.set(key, {
      value,
      timestamp: Date.now(),
      ttl: ttl * 1000,
      size: itemSize
    });

    this.currentMemoryUsage += itemSize;

    // TTL 타이머 설정
    const timer = setTimeout(() => {
      this.delete(key);
    }, ttl * 1000);
    
    this.timers.set(key, timer);
  }

  get(key) {
    const item = this.cache.get(key);
    if (!item) return null;

    // TTL 확인
    if (Date.now() - item.timestamp > item.ttl) {
      this.delete(key);
      return null;
    }

    return item.value;
  }

  delete(key) {
    const item = this.cache.get(key);
    if (item) {
      this.currentMemoryUsage -= item.size || 0;
    }
    
    this.cache.delete(key);
    if (this.timers.has(key)) {
      clearTimeout(this.timers.get(key));
      this.timers.delete(key);
    }
  }

  // 아이템 크기 계산
  calculateItemSize(value) {
    try {
      return JSON.stringify(value).length * 2; // 대략적인 바이트 크기
    } catch (error) {
      return 1000; // 기본값
    }
  }

  // 정리 필요 여부 확인
  shouldCleanup() {
    const now = Date.now();
    return (
      this.cache.size >= this.maxSize ||
      this.currentMemoryUsage >= this.maxMemoryUsage * 0.8 ||
      now - this.lastCleanup > this.cleanupInterval
    );
  }

  // 메모리 정리
  cleanup() {
    const now = Date.now();
    const toDelete = [];

    // 만료된 항목들 찾기
    for (const [key, item] of this.cache) {
      if (now - item.timestamp > item.ttl) {
        toDelete.push(key);
      }
    }

    // 삭제 실행
    toDelete.forEach(key => this.delete(key));

    // 여전히 크기가 크면 오래된 항목들 삭제
    if (this.cache.size > this.maxSize) {
      const sortedItems = Array.from(this.cache.entries())
        .sort((a, b) => a[1].timestamp - b[1].timestamp);
      
      const toDeleteCount = this.cache.size - this.maxSize;
      for (let i = 0; i < toDeleteCount; i++) {
        this.delete(sortedItems[i][0]);
      }
    }

    this.lastCleanup = now;
  }

  // 적극적 정리
  aggressiveCleanup() {
    // 메모리 사용량의 50% 정리
    const targetMemory = this.maxMemoryUsage * 0.5;
    
    const sortedItems = Array.from(this.cache.entries())
      .sort((a, b) => a[1].timestamp - b[1].timestamp);
    
    let freedMemory = 0;
    for (const [key, item] of sortedItems) {
      if (this.currentMemoryUsage - freedMemory <= targetMemory) break;
      
      this.delete(key);
      freedMemory += item.size || 0;
    }
  }

  clear() {
    // 모든 타이머 정리
    for (const timer of this.timers.values()) {
      clearTimeout(timer);
    }
    this.cache.clear();
    this.timers.clear();
  }

  size() {
    return this.cache.size;
  }

  keys() {
    return Array.from(this.cache.keys());
  }
}

// 전역 메모리 캐시 인스턴스
const memoryCache = new MemoryCache();

// KV 캐시 클래스
export class KVCache {
  constructor(kvNamespace) {
    this.kv = kvNamespace;
  }

  async set(key, value, ttl = 3600) {
    try {
      const cacheData = {
        value,
        timestamp: Date.now(),
        ttl: ttl * 1000
      };

      await this.kv.put(key, JSON.stringify(cacheData), {
        expirationTtl: ttl
      });

      return true;
    } catch (error) {
      console.error('KV Cache Set Error:', error);
      return false;
    }
  }

  async get(key) {
    try {
      const cached = await this.kv.get(key);
      if (!cached) return null;

      const cacheData = JSON.parse(cached);
      
      // TTL 확인
      if (Date.now() - cacheData.timestamp > cacheData.ttl) {
        await this.delete(key);
        return null;
      }

      return cacheData.value;
    } catch (error) {
      console.error('KV Cache Get Error:', error);
      return null;
    }
  }

  async delete(key) {
    try {
      await this.kv.delete(key);
      return true;
    } catch (error) {
      console.error('KV Cache Delete Error:', error);
      return false;
    }
  }

  async clear() {
    try {
      // KV는 전체 삭제가 제한적이므로 개별 삭제
      const keys = await this.kv.list();
      for (const key of keys.keys) {
        await this.kv.delete(key.name);
      }
      return true;
    } catch (error) {
      console.error('KV Cache Clear Error:', error);
      return false;
    }
  }
}

// 다층 캐시 클래스
export class MultiLayerCache {
  constructor(kvNamespace) {
    this.kvCache = new KVCache(kvNamespace);
    this.memoryCache = memoryCache;
  }

  async get(key, ttl = 300) {
    // 1단계: 메모리 캐시 확인
    let value = this.memoryCache.get(key);
    if (value !== null) {
      return value;
    }

    // 2단계: KV 캐시 확인
    value = await this.kvCache.get(key);
    if (value !== null) {
      // 메모리 캐시에 저장 (짧은 TTL)
      this.memoryCache.set(key, value, Math.min(ttl, 300));
      return value;
    }

    return null;
  }

  async set(key, value, ttl = 3600) {
    // 메모리 캐시에 저장 (짧은 TTL)
    this.memoryCache.set(key, value, Math.min(ttl, 300));
    
    // KV 캐시에 저장 (긴 TTL)
    return await this.kvCache.set(key, value, ttl);
  }

  async delete(key) {
    this.memoryCache.delete(key);
    return await this.kvCache.delete(key);
  }

  async clear() {
    this.memoryCache.clear();
    return await this.kvCache.clear();
  }

  // 캐시 통계
  getStats() {
    return {
      memory: {
        size: this.memoryCache.size(),
        keys: this.memoryCache.keys()
      }
    };
  }
}

// 캐시 데코레이터
export function cached(ttl = 300, keyGenerator = null) {
  return function(target, propertyKey, descriptor) {
    const originalMethod = descriptor.value;
    
    descriptor.value = async function(...args) {
      const cache = this.cache || globalCache;
      if (!cache) {
        return await originalMethod.apply(this, args);
      }

      // 캐시 키 생성
      const cacheKey = keyGenerator 
        ? keyGenerator(...args)
        : generateCacheKey(propertyKey, ...args);

      // 캐시에서 조회
      const cached = await cache.get(cacheKey, ttl);
      if (cached !== null) {
        return cached;
      }

      // 원본 메서드 실행
      const result = await originalMethod.apply(this, args);
      
      // 결과 캐싱
      await cache.set(cacheKey, result, ttl);
      
      return result;
    };
    
    return descriptor;
  };
}

// 전역 캐시 인스턴스
let globalCache = null;

// 캐시 초기화
export function initCache(kvNamespace) {
  globalCache = new MultiLayerCache(kvNamespace);
  return globalCache;
}

// 전역 캐시 가져오기
export function getCache() {
  return globalCache;
}

// 캐시 유틸리티 함수들
export async function cacheCounselors(cache, counselors) {
  const key = generateCacheKey('counselors', 'all');
  return await cache.set(key, counselors, CACHE_TTL.COUNSELORS);
}

export async function getCachedCounselors(cache) {
  const key = generateCacheKey('counselors', 'all');
  return await cache.get(key, CACHE_TTL.COUNSELORS);
}

export async function cacheNotices(cache, notices) {
  const key = generateCacheKey('notices', 'all');
  return await cache.set(key, notices, CACHE_TTL.NOTICES);
}

export async function getCachedNotices(cache) {
  const key = generateCacheKey('notices', 'all');
  return await cache.get(key, CACHE_TTL.NOTICES);
}

export async function cacheReviews(cache, reviews) {
  const key = generateCacheKey('reviews', 'all');
  return await cache.set(key, reviews, CACHE_TTL.REVIEWS);
}

export async function getCachedReviews(cache) {
  const key = generateCacheKey('reviews', 'all');
  return await cache.get(key, CACHE_TTL.REVIEWS);
}

// 캐시 무효화 함수들
export async function invalidateCounselorsCache(cache) {
  const key = generateCacheKey('counselors', 'all');
  return await cache.delete(key);
}

export async function invalidateNoticesCache(cache) {
  const key = generateCacheKey('notices', 'all');
  return await cache.delete(key);
}

export async function invalidateReviewsCache(cache) {
  const key = generateCacheKey('reviews', 'all');
  return await cache.delete(key);
}

// 캐시 상태 확인
export function getCacheStatus(cache) {
  if (!cache) return { available: false };
  
  const stats = cache.getStats();
  return {
    available: true,
    memory: {
      size: stats.memory.size,
      keys: stats.memory.keys.length
    }
  };
}

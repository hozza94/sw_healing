/**
 * 메모리 최적화 및 모니터링 시스템
 * Cloudflare Workers용 메모리 관리
 */

import { getLogger } from './logger.js';

// 메모리 사용량 추적 클래스
export class MemoryMonitor {
  constructor() {
    this.logger = getLogger();
    this.memoryStats = {
      peakUsage: 0,
      currentUsage: 0,
      allocations: 0,
      deallocations: 0,
      gcCount: 0,
      lastGC: Date.now()
    };
    
    this.buffers = new Map(); // 버퍼 관리
    this.maxBufferSize = 50; // 최대 버퍼 수
    this.maxBufferAge = 300000; // 5분 (밀리초)
    
    this.startMonitoring();
  }

  // 메모리 모니터링 시작
  startMonitoring() {
    // 메모리 사용량 추적 (간접적)
    this.trackMemoryUsage();
    
    // 주기적 가비지 컬렉션
    this.scheduleGC();
    
    // 버퍼 정리
    this.scheduleBufferCleanup();
  }

  // 메모리 사용량 추적
  trackMemoryUsage() {
    try {
      // Cloudflare Workers에서는 직접적인 메모리 정보가 제한적
      // 대신 객체 수와 버퍼 크기로 추정
      const estimatedUsage = this.estimateMemoryUsage();
      
      this.memoryStats.currentUsage = estimatedUsage;
      
      if (estimatedUsage > this.memoryStats.peakUsage) {
        this.memoryStats.peakUsage = estimatedUsage;
      }
      
      this.memoryStats.allocations++;
      
    } catch (error) {
      this.logger.error('Memory tracking error', { error: error.message });
    }
  }

  // 메모리 사용량 추정
  estimateMemoryUsage() {
    let usage = 0;
    
    // 버퍼 크기 계산
    for (const [key, buffer] of this.buffers) {
      usage += buffer.size || 0;
    }
    
    // 객체 수 기반 추정 (대략적)
    usage += this.buffers.size * 100; // 각 버퍼당 약 100바이트 오버헤드
    
    return usage;
  }

  // 버퍼 생성 및 관리
  createBuffer(key, data, maxAge = 300000) {
    const buffer = {
      data: data,
      size: JSON.stringify(data).length,
      createdAt: Date.now(),
      lastAccessed: Date.now(),
      maxAge: maxAge,
      accessCount: 0
    };
    
    // 최대 버퍼 수 확인
    if (this.buffers.size >= this.maxBufferSize) {
      this.cleanupOldBuffers();
    }
    
    this.buffers.set(key, buffer);
    this.trackMemoryUsage();
    
    return buffer;
  }

  // 버퍼 조회
  getBuffer(key) {
    const buffer = this.buffers.get(key);
    if (!buffer) return null;
    
    // 접근 시간 업데이트
    buffer.lastAccessed = Date.now();
    buffer.accessCount++;
    
    // 만료 확인
    if (Date.now() - buffer.createdAt > buffer.maxAge) {
      this.buffers.delete(key);
      this.memoryStats.deallocations++;
      return null;
    }
    
    return buffer.data;
  }

  // 오래된 버퍼 정리
  cleanupOldBuffers() {
    const now = Date.now();
    const toDelete = [];
    
    for (const [key, buffer] of this.buffers) {
      // 만료된 버퍼 또는 오래된 버퍼
      if (now - buffer.createdAt > buffer.maxAge || 
          now - buffer.lastAccessed > this.maxBufferAge) {
        toDelete.push(key);
      }
    }
    
    // 삭제 실행
    toDelete.forEach(key => {
      this.buffers.delete(key);
      this.memoryStats.deallocations++;
    });
    
    if (toDelete.length > 0) {
      this.logger.debug('Cleaned up old buffers', {
        deletedCount: toDelete.length,
        remainingBuffers: this.buffers.size
      });
    }
  }

  // 주기적 버퍼 정리 스케줄링
  scheduleBufferCleanup() {
    // 5분마다 버퍼 정리
    setTimeout(() => {
      this.cleanupOldBuffers();
      this.scheduleBufferCleanup();
    }, 300000);
  }

  // 가비지 컬렉션 스케줄링
  scheduleGC() {
    // 10분마다 가비지 컬렉션 시도
    setTimeout(() => {
      this.forceGC();
      this.scheduleGC();
    }, 600000);
  }

  // 강제 가비지 컬렉션
  forceGC() {
    try {
      // 버퍼 정리
      this.cleanupOldBuffers();
      
      // 큰 객체들 정리
      this.clearLargeObjects();
      
      this.memoryStats.gcCount++;
      this.memoryStats.lastGC = Date.now();
      
      this.logger.debug('Garbage collection performed', {
        gcCount: this.memoryStats.gcCount,
        currentUsage: this.memoryStats.currentUsage,
        bufferCount: this.buffers.size
      });
      
    } catch (error) {
      this.logger.error('Garbage collection error', { error: error.message });
    }
  }

  // 큰 객체들 정리
  clearLargeObjects() {
    // 큰 버퍼들 우선 정리
    const sortedBuffers = Array.from(this.buffers.entries())
      .sort((a, b) => b[1].size - a[1].size);
    
    // 상위 20% 큰 버퍼들 중 오래된 것들 정리
    const toClean = Math.ceil(sortedBuffers.length * 0.2);
    const now = Date.now();
    
    for (let i = 0; i < toClean; i++) {
      const [key, buffer] = sortedBuffers[i];
      if (now - buffer.lastAccessed > this.maxBufferAge / 2) {
        this.buffers.delete(key);
        this.memoryStats.deallocations++;
      }
    }
  }

  // 메모리 통계 조회
  getMemoryStats() {
    return {
      ...this.memoryStats,
      bufferCount: this.buffers.size,
      totalBufferSize: this.estimateMemoryUsage(),
      averageBufferSize: this.buffers.size > 0 
        ? Math.round(this.estimateMemoryUsage() / this.buffers.size)
        : 0
    };
  }

  // 메모리 사용량 리셋
  resetStats() {
    this.memoryStats = {
      peakUsage: 0,
      currentUsage: 0,
      allocations: 0,
      deallocations: 0,
      gcCount: 0,
      lastGC: Date.now()
    };
    
    this.buffers.clear();
    
    this.logger.info('Memory stats reset');
  }

  // 메모리 압박 상황 감지
  isMemoryPressure() {
    const stats = this.getMemoryStats();
    
    // 메모리 압박 조건
    const conditions = [
      stats.bufferCount > this.maxBufferSize * 0.8,
      stats.totalBufferSize > 1000000, // 1MB 이상
      stats.allocations > stats.deallocations * 2
    ];
    
    return conditions.some(condition => condition);
  }

  // 메모리 압박 해소
  handleMemoryPressure() {
    this.logger.warn('Memory pressure detected, performing cleanup');
    
    // 강제 가비지 컬렉션
    this.forceGC();
    
    // 추가 정리
    this.aggressiveCleanup();
  }

  // 적극적 정리
  aggressiveCleanup() {
    // 모든 버퍼의 절반 삭제 (오래된 것부터)
    const sortedBuffers = Array.from(this.buffers.entries())
      .sort((a, b) => a[1].lastAccessed - b[1].lastAccessed);
    
    const toDelete = Math.ceil(sortedBuffers.length / 2);
    
    for (let i = 0; i < toDelete; i++) {
      const [key] = sortedBuffers[i];
      this.buffers.delete(key);
      this.memoryStats.deallocations++;
    }
    
    this.logger.info('Aggressive cleanup performed', {
      deletedBuffers: toDelete,
      remainingBuffers: this.buffers.size
    });
  }
}

// 로그 버퍼 관리 클래스
export class LogBuffer {
  constructor(maxSize = 100, maxAge = 300000) {
    this.maxSize = maxSize;
    this.maxAge = maxAge;
    this.buffer = [];
    this.logger = getLogger();
  }

  add(logEntry) {
    // 버퍼 크기 확인
    if (this.buffer.length >= this.maxSize) {
      this.flush();
    }
    
    this.buffer.push({
      ...logEntry,
      timestamp: Date.now()
    });
  }

  flush() {
    if (this.buffer.length === 0) return;
    
    // 오래된 로그 제거
    const now = Date.now();
    this.buffer = this.buffer.filter(entry => 
      now - entry.timestamp < this.maxAge
    );
    
    // 로그 출력
    this.buffer.forEach(entry => {
      this.logger.info('Buffered log', entry);
    });
    
    this.buffer = [];
  }

  getSize() {
    return this.buffer.length;
  }
}

// 메트릭 데이터 관리 클래스
export class MetricsBuffer {
  constructor(maxSize = 50, maxAge = 600000) {
    this.maxSize = maxSize;
    this.maxAge = maxAge;
    this.metrics = [];
    this.logger = getLogger();
  }

  add(metric) {
    // 버퍼 크기 확인
    if (this.metrics.length >= this.maxSize) {
      this.cleanup();
    }
    
    this.metrics.push({
      ...metric,
      timestamp: Date.now()
    });
  }

  cleanup() {
    const now = Date.now();
    
    // 오래된 메트릭 제거
    this.metrics = this.metrics.filter(metric => 
      now - metric.timestamp < this.maxAge
    );
    
    // 크기 제한
    if (this.metrics.length > this.maxSize) {
      this.metrics = this.metrics.slice(-this.maxSize);
    }
  }

  getMetrics() {
    this.cleanup();
    return this.metrics;
  }

  getSize() {
    return this.metrics.length;
  }
}

// 전역 메모리 모니터 인스턴스
let globalMemoryMonitor = null;

// 메모리 모니터 초기화
export function initMemoryMonitor() {
  if (!globalMemoryMonitor) {
    globalMemoryMonitor = new MemoryMonitor();
  }
  return globalMemoryMonitor;
}

// 전역 메모리 모니터 가져오기
export function getMemoryMonitor() {
  return globalMemoryMonitor;
}

// 메모리 상태 확인
export function getMemoryStatus() {
  const monitor = getMemoryMonitor();
  if (!monitor) return { available: false };
  
  const stats = monitor.getMemoryStats();
  const isPressure = monitor.isMemoryPressure();
  
  return {
    available: true,
    stats: stats,
    pressure: isPressure,
    recommendations: isPressure ? [
      'Consider reducing buffer sizes',
      'Increase garbage collection frequency',
      'Monitor memory usage patterns'
    ] : []
  };
}

// 메모리 최적화 유틸리티
export function optimizeMemory() {
  const monitor = getMemoryMonitor();
  if (!monitor) return false;
  
  if (monitor.isMemoryPressure()) {
    monitor.handleMemoryPressure();
    return true;
  }
  
  return false;
}

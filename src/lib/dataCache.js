/**
 * 数据缓存工具
 * 使用localStorage和内存缓存来提升访问速度
 */

class DataCache {
  constructor() {
    this.memoryCache = new Map();
    this.cacheExpiry = 60 * 60 * 1000; // 缓存1小时
    this.maxMemoryCacheSize = 10; // 最大内存缓存条目数
    this.stats = {
      hits: 0,
      misses: 0,
      saves: 0
    };
  }

  // 生成缓存键
  generateKey(prefix, params = {}) {
    const paramStr = Object.keys(params)
      .sort()
      .map(key => `${key}=${params[key]}`)
      .join('&');
    return paramStr ? `${prefix}?${paramStr}` : prefix;
  }

  // 设置缓存
  set(key, data, expiry = this.cacheExpiry) {
    const cacheData = {
      data,
      expiry: Date.now() + expiry,
      createdAt: Date.now()
    };

    // 优先使用内存缓存
    if (this.memoryCache.size >= this.maxMemoryCacheSize) {
      // 删除最早的条目
      const firstKey = this.memoryCache.keys().next().value;
      this.memoryCache.delete(firstKey);
    }
    this.memoryCache.set(key, cacheData);
    this.stats.saves++;

    // 同时保存到localStorage（针对大数据）
    try {
      if (typeof data === 'object' && data !== null) {
        const serialized = JSON.stringify(cacheData);
        if (serialized.length < 5000000) { // 小于5MB
          localStorage.setItem(`cache_${key}`, serialized);
        }
      }
    } catch (e) {
      console.warn('LocalStorage缓存失败:', e);
    }
  }

  // 获取缓存
  get(key) {
    // 1. 先检查内存缓存
    if (this.memoryCache.has(key)) {
      const cacheData = this.memoryCache.get(key);
      if (Date.now() < cacheData.expiry) {
        this.stats.hits++;
        return cacheData.data;
      } else {
        this.memoryCache.delete(key);
      }
    }

    // 2. 检查localStorage
    try {
      const stored = localStorage.getItem(`cache_${key}`);
      if (stored) {
        const cacheData = JSON.parse(stored);
        if (Date.now() < cacheData.expiry) {
          // 恢复到内存缓存
          this.memoryCache.set(key, cacheData);
          this.stats.hits++;
          return cacheData.data;
        } else {
          localStorage.removeItem(`cache_${key}`);
        }
      }
    } catch (e) {
      console.warn('LocalStorage读取失败:', e);
    }

    this.stats.misses++;
    return null;
  }

  // 检查缓存是否存在
  has(key) {
    if (this.memoryCache.has(key)) {
      const cacheData = this.memoryCache.get(key);
      return Date.now() < cacheData.expiry;
    }
    
    try {
      const stored = localStorage.getItem(`cache_${key}`);
      if (stored) {
        const cacheData = JSON.parse(stored);
        return Date.now() < cacheData.expiry;
      }
    } catch (e) {
      // 忽略错误
    }
    
    return false;
  }

  // 删除缓存
  delete(key) {
    this.memoryCache.delete(key);
    try {
      localStorage.removeItem(`cache_${key}`);
    } catch (e) {
      // 忽略错误
    }
  }

  // 清空所有缓存
  clear() {
    this.memoryCache.clear();
    try {
      const keysToRemove = [];
      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (key && key.startsWith('cache_')) {
          keysToRemove.push(key);
        }
      }
      keysToRemove.forEach(key => localStorage.removeItem(key));
    } catch (e) {
      // 忽略错误
    }
    this.stats = { hits: 0, misses: 0, saves: 0 };
  }

  // 获取缓存统计
  getStats() {
    const total = this.stats.hits + this.stats.misses;
    const hitRate = total > 0 ? (this.stats.hits / total * 100).toFixed(2) : 0;
    
    return {
      ...this.stats,
      total,
      hitRate: `${hitRate}%`,
      memoryCacheSize: this.memoryCache.size
    };
  }

  // 预热缓存（提前加载常用数据）
  async warmup(requests = []) {
    console.log('开始预热缓存...');
    for (const { key, fetchFn, expiry } of requests) {
      if (!this.has(key)) {
        try {
          const data = await fetchFn();
          if (data) {
            this.set(key, data, expiry);
            console.log(`缓存预热: ${key}`);
          }
        } catch (e) {
          console.warn(`缓存预热失败: ${key}`, e);
        }
      }
    }
    console.log('缓存预热完成');
  }
}

// 创建全局实例
const dataCache = new DataCache();

export default dataCache;

// 导出静态方法作为工具函数
export const createCacheKey = (...args) => args.filter(Boolean).join(':');

export const cachedFetch = async (url, options = {}) => {
  const cacheKey = `fetch:${url}:${JSON.stringify(options)}`;
  
  // 尝试从缓存获取
  const cached = dataCache.get(cacheKey);
  if (cached) {
    return cached;
  }
  
  // 发起请求
  const response = await fetch(url, options);
  const data = await response.json();
  
  // 保存到缓存
  dataCache.set(cacheKey, data, options.cacheExpiry || 3600000);
  
  return data;
};

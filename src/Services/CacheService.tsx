// API Response Caching Service
export interface CacheEntry<T = any> {
  data: T;
  timestamp: number;
  expiresAt: number;
}

export interface CacheOptions {
  ttl?: number; // Time to live in milliseconds
  maxSize?: number; // Maximum number of entries
  staleWhileRevalidate?: boolean; // Return stale data while fetching fresh
}

class APICache {
  private cache = new Map<string, CacheEntry>();
  private defaultTTL = 5 * 60 * 1000; // 5 minutes
  private maxSize = 100;
  private accessOrder = new Map<string, number>(); // For LRU eviction

  constructor(options: CacheOptions = {}) {
    this.defaultTTL = options.ttl || this.defaultTTL;
    this.maxSize = options.maxSize || this.maxSize;

    // Clean up expired entries periodically
    setInterval(() => this.cleanup(), 60000); // Every minute
  }

  private generateKey(url: string, params?: Record<string, any>): string {
    if (!params) return url;
    const sortedParams = Object.keys(params)
      .sort()
      .map((key) => `${key}=${params[key]}`)
      .join("&");
    return `${url}?${sortedParams}`;
  }

  private isExpired(entry: CacheEntry): boolean {
    return Date.now() > entry.expiresAt;
  }

  private evictLRU(): void {
    if (this.cache.size < this.maxSize) return;

    // Find the least recently used entry
    let oldestKey = "";
    let oldestTime = Date.now();

    for (const [key, accessTime] of this.accessOrder) {
      if (accessTime < oldestTime) {
        oldestTime = accessTime;
        oldestKey = key;
      }
    }

    if (oldestKey) {
      this.cache.delete(oldestKey);
      this.accessOrder.delete(oldestKey);
    }
  }

  get<T = any>(url: string, params?: Record<string, any>): T | null {
    const key = this.generateKey(url, params);
    const entry = this.cache.get(key);

    if (!entry) return null;

    // Update access time for LRU
    this.accessOrder.set(key, Date.now());

    // Return data even if expired (stale-while-revalidate pattern)
    return entry.data;
  }

  set<T = any>(
    url: string,
    data: T,
    params?: Record<string, any>,
    ttl?: number,
  ): void {
    const key = this.generateKey(url, params);
    const now = Date.now();
    const expiresAt = now + (ttl || this.defaultTTL);

    // Evict LRU if necessary
    this.evictLRU();

    this.cache.set(key, {
      data,
      timestamp: now,
      expiresAt,
    });

    this.accessOrder.set(key, now);
  }

  isStale(url: string, params?: Record<string, any>): boolean {
    const key = this.generateKey(url, params);
    const entry = this.cache.get(key);
    return entry ? this.isExpired(entry) : true;
  }

  invalidate(url: string, params?: Record<string, any>): void {
    const key = this.generateKey(url, params);
    this.cache.delete(key);
    this.accessOrder.delete(key);
  }

  invalidatePattern(pattern: string): void {
    const regex = new RegExp(pattern);
    const keysToDelete: string[] = [];

    for (const key of this.cache.keys()) {
      if (regex.test(key)) {
        keysToDelete.push(key);
      }
    }

    keysToDelete.forEach((key) => {
      this.cache.delete(key);
      this.accessOrder.delete(key);
    });
  }

  clear(): void {
    this.cache.clear();
    this.accessOrder.clear();
  }

  private cleanup(): void {
    const now = Date.now();
    const expiredKeys: string[] = [];

    for (const [key, entry] of this.cache) {
      if (now > entry.expiresAt) {
        expiredKeys.push(key);
      }
    }

    expiredKeys.forEach((key) => {
      this.cache.delete(key);
      this.accessOrder.delete(key);
    });
  }

  getStats(): {
    size: number;
    maxSize: number;
    hitRatio: number;
    oldestEntry: number;
    newestEntry: number;
  } {
    let oldest = Date.now();
    let newest = 0;
    let hits = 0;
    let total = 0;

    for (const [, entry] of this.cache) {
      total++;
      if (entry.timestamp < oldest) oldest = entry.timestamp;
      if (entry.timestamp > newest) newest = entry.timestamp;
    }

    for (const accessTime of this.accessOrder.values()) {
      if (accessTime > Date.now() - 3600000) hits++; // Hits in last hour
    }

    return {
      size: this.cache.size,
      maxSize: this.maxSize,
      hitRatio: total > 0 ? hits / total : 0,
      oldestEntry: oldest,
      newestEntry: newest,
    };
  }
}

// Create singleton instance
export const apiCache = new APICache({
  ttl: 5 * 60 * 1000, // 5 minutes
  maxSize: 200,
  staleWhileRevalidate: true,
});

// Enhanced fetch function with caching
export async function cachedFetch<T = any>(
  url: string,
  options: RequestInit & {
    params?: Record<string, any>;
    cacheTTL?: number;
    bypassCache?: boolean;
  } = {},
): Promise<T> {
  const { params, cacheTTL, bypassCache, ...fetchOptions } = options;

  // Check cache first (unless bypassing)
  if (!bypassCache) {
    const cached = apiCache.get<T>(url, params);
    if (cached && !apiCache.isStale(url, params)) {
      return cached;
    }
  }

  // Build URL with params
  let fullUrl = url;
  if (params) {
    const searchParams = new URLSearchParams();
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        searchParams.append(key, String(value));
      }
    });
    fullUrl += `?${searchParams.toString()}`;
  }

  try {
    const response = await fetch(fullUrl, fetchOptions);

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data: T = await response.json();

    // Cache the response
    apiCache.set(url, data, params, cacheTTL);

    return data;
  } catch (error) {
    // If we have stale data, return it as fallback
    const staleData = apiCache.get<T>(url, params);
    if (staleData) {
      console.warn("Using stale data due to fetch error:", error);
      return staleData;
    }

    throw error;
  }
}

// Preload function for critical resources
export function preloadAPIData(
  requests: Array<{ url: string; params?: Record<string, any> }>,
) {
  return Promise.allSettled(
    requests.map(
      ({ url, params }) =>
        cachedFetch(url, { params, cacheTTL: 10 * 60 * 1000 }), // 10 minutes cache for preloaded data
    ),
  );
}

// Cache warming function
export async function warmCache() {
  const criticalEndpoints = [
    { url: "/api/trending", params: { page: 1 } },
    { url: "/api/genres", params: {} },
    { url: "/api/popular", params: { page: 1 } },
  ];

  await preloadAPIData(criticalEndpoints);
}

// Cache performance monitor
export function monitorCachePerformance() {
  setInterval(() => {
    // Performance monitoring available for debugging if needed
    // apiCache.getStats() can be called here in development mode
  }, 60000); // Check every minute
}

// Service Worker cache strategies
export const cacheStrategies = {
  // Cache first, falling back to network
  cacheFirst: async (request: Request): Promise<Response> => {
    const cache = await caches.open("disney-clone-v1");
    const cached = await cache.match(request);

    if (cached) {
      return cached;
    }

    const response = await fetch(request);
    if (response.ok) {
      cache.put(request, response.clone());
    }

    return response;
  },

  // Network first, falling back to cache
  networkFirst: async (request: Request): Promise<Response> => {
    const cache = await caches.open("disney-clone-v1");

    try {
      const response = await fetch(request);
      if (response.ok) {
        cache.put(request, response.clone());
      }
      return response;
    } catch {
      const cached = await cache.match(request);
      if (cached) {
        return cached;
      }
      throw new Error("No cached response available");
    }
  },

  // Stale while revalidate
  staleWhileRevalidate: async (request: Request): Promise<Response> => {
    const cache = await caches.open("disney-clone-v1");
    const cached = await cache.match(request);

    // Start revalidation in background
    const fetchPromise = fetch(request).then((response) => {
      if (response.ok) {
        cache.put(request, response.clone());
      }
      return response;
    });

    // Return cached version immediately if available
    return cached || fetchPromise;
  },
};

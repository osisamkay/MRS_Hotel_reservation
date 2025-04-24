// src/utils/cacheUtils.ts

/**
 * A simple in-memory cache with automatic expiration
 */
class MemoryCache {
    private cache: Map<string, { value: any; expires: number }> = new Map();

    /**
     * Set a value in the cache with an expiration time
     * @param key The cache key
     * @param value The value to cache
     * @param ttlSeconds Time to live in seconds (default: 5 minutes)
     */
    set(key: string, value: any, ttlSeconds: number = 300): boolean {
        const expires = Date.now() + ttlSeconds * 1000;
        this.cache.set(key, { value, expires });

        // Schedule cleanup for this item when it expires
        setTimeout(() => {
            if (this.has(key) && this.cache.get(key)?.expires === expires) {
                this.delete(key);
            }
        }, ttlSeconds * 1000);

        return true;
    }

    /**
     * Get a value from the cache
     * @param key The cache key
     * @returns The cached value or undefined if not found or expired
     */
    get<T>(key: string): T | undefined {
        const item = this.cache.get(key);

        // Return undefined if item doesn't exist or has expired
        if (!item || item.expires < Date.now()) {
            if (item) this.delete(key); // Delete expired item
            return undefined;
        }

        return item.value as T;
    }

    /**
     * Check if a key exists in the cache and is not expired
     * @param key The cache key
     * @returns True if the key exists and is not expired
     */
    has(key: string): boolean {
        const item = this.cache.get(key);
        const exists = !!item && item.expires > Date.now();

        // Clean up expired items
        if (item && !exists) {
            this.delete(key);
        }

        return exists;
    }

    /**
     * Delete a key from the cache
     * @param key The cache key
     */
    delete(key: string): boolean {
        return this.cache.delete(key);
    }

    /**
     * Clear all items from the cache
     */
    clear(): void {
        this.cache.clear();
    }

    /**
     * Get or set a value in the cache
     * If the key doesn't exist, it calls the factory function to create the value
     * @param key The cache key
     * @param factory A function that returns a value or a promise for a value
     * @param ttlSeconds Time to live in seconds
     * @returns The cached value or the result of the factory function
     */
    async getOrSet<T>(key: string, factory: () => Promise<T>, ttlSeconds: number = 300): Promise<T> {
        const cachedValue = this.get<T>(key);

        if (cachedValue !== undefined) {
            return cachedValue;
        }

        const value = await factory();
        this.set(key, value, ttlSeconds);
        return value;
    }

    /**
     * Delete all keys that start with the given prefix
     * @param keyPrefix The prefix to match against cache keys
     */
    deleteByPrefix(keyPrefix: string): void {
        const keysToDelete: string[] = [];

        this.cache.forEach((_, key) => {
            if (key.startsWith(keyPrefix)) {
                keysToDelete.push(key);
            }
        });

        keysToDelete.forEach(key => this.delete(key));
    }

    /**
     * Flush all items from the cache
     */
    flush(): void {
        this.clear();
    }
}

// Create and export a singleton instance
export const memoryCache = new MemoryCache();

/**
 * Wrap a fetch call with caching
 * @param url The URL to fetch
 * @param options Fetch options
 * @param ttlSeconds Cache TTL in seconds (default: 5 minutes)
 * @returns The response JSON
 */
export async function cachedFetch<T>(
    url: string,
    options?: RequestInit,
    ttlSeconds: number = 300
): Promise<T> {
    const cacheKey = `fetch:${url}:${JSON.stringify(options || {})}`;

    return memoryCache.getOrSet<T>(
        cacheKey,
        async () => {
            const response = await fetch(url, options);
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            return await response.json();
        },
        ttlSeconds
    );
}

/**
 * Wrap an expensive calculation with caching
 * @param cacheKey A unique key for this calculation
 * @param calculation The calculation function
 * @param ttlSeconds Cache TTL in seconds (default: 5 minutes)
 * @returns The calculation result
 */
export async function cachedCalculation<T>(
    cacheKey: string,
    calculation: () => Promise<T>,
    ttlSeconds: number = 300
): Promise<T> {
    return memoryCache.getOrSet<T>(
        `calc:${cacheKey}`,
        calculation,
        ttlSeconds
    );
}

/**
 * Clear all cached data
 */
export function clearCache(): void {
    memoryCache.clear();
}

/**
 * Clear all cache entries that start with the given prefix
 * @param keyPrefix The prefix to match against cache keys
 */
export function clearCacheByPrefix(keyPrefix: string): void {
    memoryCache.deleteByPrefix(keyPrefix);
}

/**
 * Get a value from cache
 * @param key The cache key
 * @returns The cached value or undefined if not found
 */
export function getCacheValue<T>(key: string): T | undefined {
    return memoryCache.get<T>(key);
}

/**
 * Set a value in cache
 * @param key The cache key
 * @param value The value to cache
 * @param ttl Time to live in seconds (optional)
 * @returns true if successful, false otherwise
 */
export function setCacheValue<T>(key: string, value: T, ttl?: number): boolean {
    return memoryCache.set(key, value, ttl);
}

/**
 * Delete a value from cache
 * @param key The cache key
 * @returns true if successful, false otherwise
 */
export function deleteCacheValue(key: string): boolean {
    return memoryCache.delete(key);
}

/**
 * Clear all cache entries
 */
export function flushCache(): void {
    memoryCache.flush();
}
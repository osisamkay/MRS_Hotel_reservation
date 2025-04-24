import NodeCache from 'node-cache';

class MemoryCache {
    private cache: NodeCache;
    private defaultTTL: number = 60 * 5; // 5 minutes default TTL

    constructor() {
        this.cache = new NodeCache({
            stdTTL: this.defaultTTL,
            checkperiod: 60, // Check for expired keys every minute
        });
    }

    get<T>(key: string): T | undefined {
        return this.cache.get<T>(key);
    }

    set<T>(key: string, value: T, ttl: number = this.defaultTTL): boolean {
        return this.cache.set(key, value, ttl);
    }

    del(key: string | string[]): number {
        return this.cache.del(key);
    }

    flush(): void {
        this.cache.flushAll();
    }

    keys(): string[] {
        return this.cache.keys();
    }

    deleteByPrefix(keyPrefix: string): void {
        const keysToDelete = this.keys().filter(key => key.startsWith(keyPrefix));
        if (keysToDelete.length > 0) {
            this.del(keysToDelete);
        }
    }
}

export const memoryCache = new MemoryCache(); 
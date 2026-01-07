import { redisClient } from '@/configs/redis.config';

export class CacheService {
  private static instance: CacheService;
  private redis = redisClient;

  static getInstance(): CacheService {
    if (!CacheService.instance) {
      CacheService.instance = new CacheService();
    }
    return CacheService.instance;
  }

  async set(key: string, value: any, ttl?: number): Promise<void> {
    try {
      const serializedValue = JSON.stringify(value);
      if (ttl) {
        await this.redis.setex(key, ttl, serializedValue);
      } else {
        await this.redis.set(key, serializedValue);
      }
    } catch (error) {
      console.error('Cache set error:', error);
    }
  }

  async get<T>(key: string): Promise<T | null> {
    try {
      const value = await this.redis.get(key);
      return value ? JSON.parse(value) : null;
    } catch (error) {
      console.error('Cache get error:', error);
      return null;
    }
  }

  async del(key: string): Promise<void> {
    try {
      await this.redis.del(key);
    } catch (error) {
      console.error('Cache delete error:', error);
    }
  }

  async exists(key: string): Promise<boolean> {
    try {
      const result = await this.redis.exists(key);
      return result === 1;
    } catch (error) {
      console.error('Cache exists error:', error);
      return false;
    }
  }

  async setSession(userId: string, sessionData: any, ttl: number = 3600): Promise<void> {
    const key = `session:${userId}`;
    await this.set(key, sessionData, ttl);
  }

  async getSession(userId: string): Promise<any> {
    const key = `session:${userId}`;
    return await this.get(key);
  }

  async invalidateSession(userId: string): Promise<void> {
    const key = `session:${userId}`;
    await this.del(key);
  }

  async setRefreshToken(token: string, userId: string, ttl: number = 604800): Promise<void> {
    const key = `refresh_token:${token}`;
    await this.set(key, { userId, token }, ttl);
  }

  async getRefreshToken(token: string): Promise<any> {
    const key = `refresh_token:${token}`;
    return await this.get(key);
  }

  async invalidateRefreshToken(token: string): Promise<void> {
    const key = `refresh_token:${token}`;
    await this.del(key);
  }

  async setRateLimit(key: string, limit: number, windowMs: number): Promise<boolean> {
    try {
      const current = await this.redis.incr(key);
      if (current === 1) {
        await this.redis.expire(key, Math.ceil(windowMs / 1000));
      }
      return current <= limit;
    } catch (error) {
      console.error('Rate limit error:', error);
      return true;
    }
  }

  async getRateLimit(key: string): Promise<number> {
    try {
      const current = await this.redis.get(key);
      return current ? parseInt(current) : 0;
    } catch (error) {
      console.error('Rate limit get error:', error);
      return 0;
    }
  }

  async cacheQuery<T>(key: string, queryFn: () => Promise<T>, ttl: number = 300): Promise<T> {
    const cached = await this.get<T>(key);
    if (cached) {
      return cached;
    }

    const result = await queryFn();
    await this.set(key, result, ttl);
    return result;
  }

  async invalidatePattern(pattern: string): Promise<void> {
    try {
      const keys = await this.redis.keys(pattern);
      if (keys.length > 0) {
        await this.redis.del(...keys);
      }
    } catch (error) {
      console.error('Cache pattern invalidation error:', error);
    }
  }
}

export const cacheService = CacheService.getInstance();

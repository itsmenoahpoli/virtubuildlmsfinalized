import { Redis } from 'ioredis';

export const redisConfig = {
  host: process.env.REDIS_HOST || 'localhost',
  port: parseInt(process.env.REDIS_PORT || '6379'),
  password: process.env.REDIS_PASSWORD,
  db: parseInt(process.env.REDIS_DB || '0'),
  retryDelayOnFailover: 100,
  maxRetriesPerRequest: 3,
  lazyConnect: true,
  keepAlive: 30000,
};

export const createRedisClient = (): Redis => {
  return new Redis(redisConfig);
};

export const redisClient = createRedisClient();

redisClient.on('connect', () => {
  console.log('Redis connected successfully');
});

redisClient.on('error', (error) => {
  console.error('Redis connection error:', error);
});

redisClient.on('close', () => {
  console.log('Redis connection closed');
});

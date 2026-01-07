import { Request, Response, NextFunction } from 'express';
import { cacheService } from '@/services/cache.service';
import { SendHttpResponse } from '@/utils';
import { HttpStatusCode } from '@/types';

interface RateLimitOptions {
  windowMs: number;
  max: number;
  message?: string;
  skipSuccessfulRequests?: boolean;
  skipFailedRequests?: boolean;
}

export const createRateLimit = (options: RateLimitOptions) => {
  const { windowMs, max, message = 'Too many requests', skipSuccessfulRequests = false, skipFailedRequests = false } = options;

  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      const key = `rate_limit:${req.ip}:${req.path}`;
      const isAllowed = await cacheService.setRateLimit(key, max, windowMs);

      if (!isAllowed) {
        return SendHttpResponse(
          res,
          { message, retryAfter: Math.ceil(windowMs / 1000) },
          HttpStatusCode.TOO_MANY_REQUESTS
        );
      }

      const originalSend = res.send;
      res.send = function (body) {
        const statusCode = res.statusCode;
        const isSuccess = statusCode >= 200 && statusCode < 300;
        const isError = statusCode >= 400;

        if ((skipSuccessfulRequests && isSuccess) || (skipFailedRequests && isError)) {
          return originalSend.call(this, body);
        }

        return originalSend.call(this, body);
      };

      next();
    } catch (error) {
      console.error('Rate limit middleware error:', error);
      next();
    }
  };
};

export const authRateLimit = createRateLimit({
  windowMs: 15 * 60 * 1000,
  max: 5,
  message: 'Too many authentication attempts, please try again later',
});

export const apiRateLimit = createRateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  message: 'Too many requests, please try again later',
});

export const strictRateLimit = createRateLimit({
  windowMs: 60 * 1000,
  max: 10,
  message: 'Rate limit exceeded, please slow down',
});

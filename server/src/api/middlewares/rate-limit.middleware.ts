import { Request, Response, NextFunction } from 'express';
import rateLimitMiddleware from 'express-rate-limit';

// Create a rate limiter middleware
export const rateLimit = (options: {
  windowMs: number;
  max: number;
  message?: string | object;
}) => {
  return rateLimitMiddleware({
    windowMs: options.windowMs,
    max: options.max,
    message: options.message || 'Too many requests, please try again later',
    // Use default IP-based limiting unless we add custom options later
    standardHeaders: true,
    legacyHeaders: false,
  });
}; 
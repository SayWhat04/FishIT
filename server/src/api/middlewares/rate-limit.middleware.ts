import rateLimitMiddleware from 'express-rate-limit';


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
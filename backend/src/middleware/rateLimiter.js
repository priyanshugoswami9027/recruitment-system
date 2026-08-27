const redisClient = require('../config/redis');


const rateLimiter = ({ windowMs = 15 * 60 * 1000, max = 5 }) => {
  return async (req, res, next) => {
    try {
      
      const identifier = req.body.email || req.ip;
      
      
      const key = `ratelimit:${req.originalUrl}:${identifier}`;
      
      const now = Date.now();
      const windowStart = now - windowMs;

      
      const multi = redisClient.multi();
      
      
      multi.zremrangebyscore(key, 0, windowStart);
      
      multi.zcard(key);
      
      multi.zadd(key, now, now);
      
      multi.pexpire(key, windowMs);

     
      const results = await multi.exec();
      
      
      const requestCount = results[1][1];

     
      if (requestCount >= max) {
        
        const retryAfter = Math.ceil(windowMs / 1000);
        res.set('Retry-After', String(retryAfter));
        
        return res.status(429).json({
          success: false,
          message: `Too many requests. Please try again after ${retryAfter} seconds.`,
        });
      }

      next();
    } catch (error) {
      console.error('Rate Limiter Error:', error);
      next();
    }
  };
};

module.exports = rateLimiter;
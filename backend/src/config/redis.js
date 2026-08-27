const Redis = require('ioredis');


const redisUri = process.env.REDIS_URI || 'redis://127.0.0.1:6379';

const redisClient = new Redis(redisUri, {
  
  retryStrategy(times) {
    const delay = Math.min(times * 50, 2000);
    return delay;
  },
  maxRetriesPerRequest: 3,
});

redisClient.on('connect', () => {
  console.log('Redis connected successfully');
});

redisClient.on('error', (err) => {
  console.error('Redis connection error:', err.message);
});

module.exports = redisClient;
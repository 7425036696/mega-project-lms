const Redis = require("ioredis");
const dotenv = require("dotenv");

dotenv.config();

const redisUrl = process.env.REDIS_URL || "";

const redis = new Redis(redisUrl, {
  retryStrategy(times) {
    const delay = Math.min(times * 50, 2000);
    return delay;
  },
  maxRetriesPerRequest: 5,
});

redis.on("connect", () => {
  console.log("Connected to Redis");
});

redis.on("error", (error) => {
  console.error("Redis connection error:", error.message);
});

module.exports = redis;
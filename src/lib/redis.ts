import IORedis from "ioredis";

export const redis = new IORedis(
  process.env.REDIS_URL || "redis://localhost:6379"
);

redis.ping().then(console.log);

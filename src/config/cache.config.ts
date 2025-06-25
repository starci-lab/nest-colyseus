import '@libs/utils/dotenv';
import { get } from 'env-var';

export const cacheConfig = {
  host: get('REDIS_HOST').asString(),
  port: get('REDIS_PORT').default(6379).asPortNumber(),
  password: get('REDIS_PASSWORD').default('').asString(),
  family: get('REDIS_FAMILY').default(4).asIntPositive(),
  retryStrategy(times) {
    return Math.min(times * 50, 2000);
  },
  connectTimeout: 10000,
};

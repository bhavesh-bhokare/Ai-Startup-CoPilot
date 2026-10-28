import { Ratelimit } from "@upstash/ratelimit";
import { Redis } from "@upstash/redis";

const redis = Redis.fromEnv();

/* ============================================================
   VALIDATION RATE LIMIT
   4 validation requests per minute per authenticated user
============================================================ */

export const validationRateLimit = new Ratelimit({
  redis,

  limiter: Ratelimit.slidingWindow(
    4,
    "1 m"
  ),

  analytics: true,
});

/* ============================================================
   HISTORY RATE LIMIT
   30 history requests per minute per authenticated user
============================================================ */

export const historyRateLimit = new Ratelimit({
  redis,

  limiter: Ratelimit.slidingWindow(
    30,
    "1 m"
  ),

  analytics: true,
});

/* ============================================================
   ANALYTICS RATE LIMIT
   30 analytics requests per minute per authenticated user
============================================================ */

export const analyticsRateLimit = new Ratelimit({
  redis,

  limiter: Ratelimit.slidingWindow(
    30,
    "1 m"
  ),

  analytics: true,
});
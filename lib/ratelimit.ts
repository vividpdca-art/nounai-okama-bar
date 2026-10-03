import { Ratelimit } from "@upstash/ratelimit";
import { Redis } from "@upstash/redis";

const redisUrl = process.env.KV_REST_API_URL;
const redisToken = process.env.KV_REST_API_TOKEN;

// Redis クライアントの初期化 (環境変数が無い場合は null)
export const redis = (redisUrl && redisToken)
  ? new Redis({ url: redisUrl, token: redisToken })
  : null;

// レートリミットの定義: 1分間に5回まで
// redis が null の場合は、後の処理で fail-closed / fail-open を制御する
export const ratelimit = redis
  ? new Ratelimit({
      redis: redis,
      limiter: Ratelimit.slidingWindow(5, "1 m"),
      analytics: true,
      prefix: "@upstash/ratelimit",
    })
  : null;

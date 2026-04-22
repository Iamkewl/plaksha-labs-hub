type RateLimitInput = {
  key: string;
  limit: number;
  windowMs: number;
};

export type RateLimitResult = {
  ok: boolean;
  limit: number;
  remaining: number;
  reset: number;
};

type LocalBucket = {
  count: number;
  reset: number;
};

const localStore = new Map<string, LocalBucket>();

function localRateLimit({ key, limit, windowMs }: RateLimitInput): RateLimitResult {
  const now = Date.now();
  const existing = localStore.get(key);

  if (!existing || existing.reset <= now) {
    const reset = now + windowMs;
    localStore.set(key, { count: 1, reset });
    return { ok: true, limit, remaining: Math.max(0, limit - 1), reset };
  }

  existing.count += 1;
  const ok = existing.count <= limit;
  return {
    ok,
    limit,
    remaining: Math.max(0, limit - existing.count),
    reset: existing.reset,
  };
}

async function upstashRateLimit({ key, limit, windowMs }: RateLimitInput): Promise<RateLimitResult> {
  const url = process.env.UPSTASH_REDIS_REST_URL;
  const token = process.env.UPSTASH_REDIS_REST_TOKEN;

  if (!url || !token) {
    return localRateLimit({ key, limit, windowMs });
  }

  const safeKey = encodeURIComponent(key);
  const base = url.replace(/\/+$/, "");

  const headers: Record<string, string> = {
    Authorization: `Bearer ${token}`,
  };

  try {
    const incrResp = await fetch(`${base}/incr/${safeKey}`, { headers, cache: "no-store" });
    if (!incrResp.ok) {
      throw new Error(`Upstash INCR failed with ${incrResp.status}`);
    }

    const incrJson = (await incrResp.json()) as { result: number };
    const count = Number(incrJson.result);

    if (count === 1) {
      await fetch(`${base}/pexpire/${safeKey}/${windowMs}`, { headers, cache: "no-store" });
    }

    const ttlResp = await fetch(`${base}/pttl/${safeKey}`, { headers, cache: "no-store" });
    let ttl = windowMs;
    if (ttlResp.ok) {
      const ttlJson = (await ttlResp.json()) as { result: number };
      const ttlValue = Number(ttlJson.result);
      ttl = ttlValue > 0 ? ttlValue : windowMs;
    }

    return {
      ok: count <= limit,
      limit,
      remaining: Math.max(0, limit - count),
      reset: Date.now() + ttl,
    };
  } catch {
    // Fail open to local memory limiter if Upstash is unavailable.
    return localRateLimit({ key, limit, windowMs });
  }
}

export async function checkRateLimit(input: RateLimitInput): Promise<RateLimitResult> {
  return upstashRateLimit(input);
}

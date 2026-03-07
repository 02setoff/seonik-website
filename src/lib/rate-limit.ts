/**
 * 인메모리 Rate Limiter
 * - 서버리스 환경에서는 인스턴스별로 동작 (기본 보호 제공)
 * - 프로덕션 강화: Upstash Redis + @upstash/ratelimit 권장
 */

interface Entry {
  count: number;
  resetAt: number;
}

const store = new Map<string, Entry>();

// 오래된 항목 주기적 정리 (메모리 누수 방지)
if (typeof setInterval !== "undefined") {
  setInterval(() => {
    const now = Date.now();
    store.forEach((v, k) => {
      if (now > v.resetAt) store.delete(k);
    });
  }, 5 * 60 * 1000); // 5분마다
}

/**
 * @param key     식별 키 (IP + endpoint 조합 권장)
 * @param limit   허용 횟수
 * @param windowMs 시간 창 (밀리초)
 * @returns { allowed, remaining, resetAt }
 */
export function rateLimit(
  key: string,
  limit: number,
  windowMs: number
): { allowed: boolean; remaining: number; resetAt: number } {
  const now = Date.now();
  const entry = store.get(key);

  if (!entry || now > entry.resetAt) {
    const resetAt = now + windowMs;
    store.set(key, { count: 1, resetAt });
    return { allowed: true, remaining: limit - 1, resetAt };
  }

  if (entry.count >= limit) {
    return { allowed: false, remaining: 0, resetAt: entry.resetAt };
  }

  entry.count++;
  return { allowed: true, remaining: limit - entry.count, resetAt: entry.resetAt };
}

/** Request 객체에서 클라이언트 IP 추출 */
export function getClientIp(request: Request): string {
  return (
    request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ??
    request.headers.get("x-real-ip") ??
    "unknown"
  );
}

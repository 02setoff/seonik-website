/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "*.public.blob.vercel-storage.com",
      },
    ],
  },
  async headers() {
    // Content-Security-Policy 정책
    // - default-src 'self': 기본적으로 동일 출처만 허용
    // - script-src: Next.js 인라인 스크립트 + Google OAuth 허용
    // - style-src: 인라인 스타일 허용 (Tailwind/inline CSS)
    // - img-src: 동일 출처 + data URI + Vercel Blob Storage + Google 프로필 이미지
    // - font-src: Google Fonts (Pretendard CDN 포함)
    // - connect-src: API 요청 + NextAuth + Google OAuth
    // - frame-src: Google OAuth 팝업
    // - object-src 'none': 플러그인 완전 차단 (XSS 방어)
    // - base-uri 'self': base 태그 악용 방지
    // - form-action 'self': 폼 제출 대상 제한
    const csp = [
      "default-src 'self'",
      "script-src 'self' 'unsafe-inline' 'unsafe-eval' https://accounts.google.com https://apis.google.com",
      "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com https://cdn.jsdelivr.net",
      "font-src 'self' https://fonts.gstatic.com https://cdn.jsdelivr.net",
      "img-src 'self' data: blob: https://*.public.blob.vercel-storage.com https://lh3.googleusercontent.com https://lh4.googleusercontent.com",
      "connect-src 'self' https://accounts.google.com",
      "frame-src https://accounts.google.com",
      "object-src 'none'",
      "base-uri 'self'",
      "form-action 'self'",
      "upgrade-insecure-requests",
    ].join("; ");

    return [
      {
        source: "/(.*)",
        headers: [
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "X-Frame-Options", value: "DENY" },
          { key: "X-XSS-Protection", value: "1; mode=block" },
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
          { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=()" },
          {
            key: "Strict-Transport-Security",
            value: "max-age=63072000; includeSubDomains; preload",
          },
          { key: "Content-Security-Policy", value: csp },
        ],
      },
    ];
  },
};

module.exports = nextConfig;

import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "소개 | 선익 SEONIK",
  description:
    "정보 비대칭의 장벽을 파괴하여, 대한민국의 저성장을 돌파할 실행가들을 무장시킨다.",
};

const SUB_PAGES = [
  { label: "미션", href: "/about/mission", desc: "선익이 존재하는 이유" },
  { label: "비전", href: "/about/vision", desc: "제1의 민간 정보기관" },
  { label: "회사명", href: "/about/company", desc: "先益의 어원과 뜻" },
  { label: "슬로건", href: "/about/slogan", desc: "Know First, Win First." },
  { label: "연혁", href: "/about/history", desc: "창업부터 현재까지" },
];

export default function AboutPage() {
  return (
    <div className="page-transition">
      {/* Mission Section */}
      <section className="pt-32 lg:pt-40 pb-20 lg:pb-24 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <p className="text-xs tracking-[0.3em] uppercase text-slate-400 mb-6">
            Our Mission
          </p>
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-midnight-slate mb-8 leading-tight text-balance">
            우리의 미션
          </h1>
          <blockquote className="text-lg md:text-xl lg:text-2xl text-slate-600 leading-relaxed max-w-3xl mx-auto text-balance">
            &ldquo;정보 비대칭의 장벽을 파괴하여,
            <br className="hidden md:block" />
            대한민국의 저성장을 돌파할
            <br className="hidden md:block" />
            실행가들을 무장시킨다.&rdquo;
          </blockquote>
        </div>
      </section>

      {/* Divider */}
      <div className="max-w-6xl mx-auto px-6">
        <div className="border-t border-slate-200" />
      </div>

      {/* Problem Definition Section */}
      <section className="py-20 lg:py-28 px-6">
        <div className="max-w-4xl mx-auto">
          <p className="text-xs tracking-[0.3em] uppercase text-slate-400 mb-6 text-center">
            Why SEONIK
          </p>
          <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold text-midnight-slate mb-12 text-center">
            왜 선익인가?
          </h2>

          <div className="space-y-8 max-w-3xl mx-auto">
            <p className="text-base md:text-lg text-slate-600 leading-relaxed">
              지금 이 순간에도, 대기업은 수십억 원의 컨설팅 비용을 들여 시장
              정보와 경쟁사 분석을 받고 있습니다.
            </p>

            <div className="py-8 px-8 md:px-12 border-l-2 border-midnight-slate bg-pure-white">
              <p className="text-lg md:text-xl font-medium text-midnight-slate mb-2">
                1인 사업자와 소규모 창업자는?
              </p>
              <p className="text-base text-slate-600 leading-relaxed">
                구조적으로 이와 같은 수준의 전략 컨설팅에 접근하지 못합니다.
                결국 검증되지 않은 유튜브, 파편화된 블로그, 그리고 &ldquo;감&rdquo;에
                의존하여 회사의 명운이 걸린 결정을 내립니다.
              </p>
            </div>

            <p className="text-base md:text-lg text-slate-600 leading-relaxed">
              이것은 정보의 양 문제가 아닙니다.{" "}
              <span className="font-semibold text-midnight-slate">
                비용·언어·시간·해석
              </span>
              이라는 4가지 거대한 장벽에 가로막혀 있습니다.
            </p>

            <p className="text-lg md:text-xl font-medium text-midnight-slate">
              선익은 이 장벽을 줄이는 것이 아닌, 완전히 파괴합니다.
            </p>
          </div>
        </div>
      </section>

      {/* Divider */}
      <div className="max-w-6xl mx-auto px-6">
        <div className="border-t border-slate-200" />
      </div>

      {/* Sub Pages Navigation */}
      <section className="py-20 lg:py-28 px-6">
        <div className="max-w-4xl mx-auto">
          <p className="text-xs tracking-[0.3em] uppercase text-slate-400 mb-6 text-center">
            About SEONIK
          </p>
          <h2 className="text-2xl md:text-3xl font-bold text-midnight-slate mb-12 text-center">
            선익을 더 알아보기
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 max-w-2xl mx-auto">
            {SUB_PAGES.map((page) => (
              <Link
                key={page.href}
                href={page.href}
                style={{
                  display: "block",
                  padding: "20px 22px",
                  border: "1px solid #E2E8F0",
                  textDecoration: "none",
                  transition: "border-color 0.15s",
                }}
                onMouseEnter={(e) =>
                  ((e.currentTarget as HTMLElement).style.borderColor = "#0F172A")
                }
                onMouseLeave={(e) =>
                  ((e.currentTarget as HTMLElement).style.borderColor = "#E2E8F0")
                }
              >
                <p
                  style={{
                    fontSize: "15px",
                    fontFamily: "'Pretendard', sans-serif",
                    fontWeight: 700,
                    color: "#0F172A",
                    marginBottom: "4px",
                  }}
                >
                  {page.label}
                </p>
                <p
                  style={{
                    fontSize: "12px",
                    fontFamily: "'Pretendard', sans-serif",
                    color: "#94A3B8",
                    margin: 0,
                  }}
                >
                  {page.desc}
                </p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Timeline Section */}
      <div className="max-w-6xl mx-auto px-6">
        <div className="border-t border-slate-200" />
      </div>
      <section className="py-20 lg:py-28 px-6">
        <div className="max-w-4xl mx-auto">
          <p className="text-xs tracking-[0.3em] uppercase text-slate-400 mb-6 text-center">
            Milestones
          </p>
          <h2 className="text-2xl md:text-3xl font-bold text-midnight-slate mb-16 text-center">
            연혁
          </h2>

          <div className="max-w-lg mx-auto space-y-8">
            <div className="flex items-start gap-6">
              <div className="flex-shrink-0 w-24 text-right">
                <span className="text-sm font-medium text-midnight-slate">
                  2026.03
                </span>
              </div>
              <div className="flex-shrink-0 w-px h-full relative">
                <div className="w-2 h-2 rounded-full bg-midnight-slate absolute -left-[3px] top-2" />
              </div>
              <div>
                <p className="text-sm font-semibold text-midnight-slate mb-1">선익 창업</p>
                <p className="text-xs text-slate-500">AI 네이티브 비즈니스 인텔리전스 브리핑 서비스 개발 시작</p>
              </div>
            </div>

            <div className="flex items-start gap-6">
              <div className="flex-shrink-0 w-24 text-right">
                <span className="text-sm font-medium text-midnight-slate">
                  2026.03
                </span>
              </div>
              <div className="flex-shrink-0 w-px h-full relative">
                <div className="w-2 h-2 rounded-full bg-midnight-slate absolute -left-[3px] top-2" />
              </div>
              <div>
                <p className="text-sm font-semibold text-midnight-slate mb-1">선익 웹사이트 런칭</p>
                <p className="text-xs text-slate-500">RADAR·CORE·FLASH 3대 브리핑 채널 오픈</p>
              </div>
            </div>
          </div>

          <div className="text-center mt-10">
            <Link
              href="/about/history"
              className="text-sm text-slate-500 hover:text-midnight-slate transition-colors"
              style={{ fontFamily: "'Pretendard', sans-serif" }}
            >
              전체 연혁 보기 →
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}

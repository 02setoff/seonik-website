import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "소개 | 선익 SEONIK",
  description:
    "정보 비대칭 장벽을 파괴하여 모든 사업가가 공정하게 경쟁할 수 있는 세상을 만듭니다.",
};

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
            &ldquo;정보 비대칭 장벽을 파괴하여
            <br className="hidden md:block" />
            모든 사업가가 공정하게 경쟁할 수 있는
            <br className="hidden md:block" />
            세상을 만듭니다.&rdquo;
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
                혼자서 구글링하고, 감으로 결정하고, 실패하고 있습니다.
              </p>
            </div>

            <p className="text-base md:text-lg text-slate-600 leading-relaxed">
              이것이{" "}
              <span className="font-semibold text-midnight-slate">
                정보 비대칭
              </span>
              입니다.
            </p>

            <p className="text-lg md:text-xl font-medium text-midnight-slate">
              선익은 이 불공정한 게임의 규칙을 바꿉니다.
            </p>
          </div>
        </div>
      </section>

      {/* Timeline Section */}
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
                <p className="text-sm text-slate-600">선익 설립</p>
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
                <p className="text-sm text-slate-600">예비창업패키지 지원</p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

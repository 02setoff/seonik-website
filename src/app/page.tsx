import Link from "next/link";
import {
  ArrowUpRight,
  ShieldCheck,
  Brain,
  Target,
  Instagram,
  Mail,
} from "lucide-react";

export default function Home() {
  return (
    <div className="page-transition">
      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center px-6">
        <div className="max-w-4xl mx-auto text-center">
          {/* Logo Symbol */}
          <div className="mb-10 flex justify-center">
            <div className="w-16 h-16 flex items-center justify-center">
              <svg
                width="48"
                height="48"
                viewBox="0 0 28 28"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M7 21L21 7M21 7H9M21 7V19"
                  stroke="#0F172A"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </div>
          </div>

          {/* Title */}
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold tracking-tight text-midnight-slate mb-3 font-display">
            SEONIK
          </h1>
          <p className="text-sm md:text-base tracking-[0.3em] text-slate-400 mb-10">
            선익
          </p>

          {/* Tagline */}
          <p className="text-xl md:text-2xl lg:text-3xl font-medium text-midnight-slate mb-6 text-balance">
            먼저 아는 자가 이긴다.
          </p>
          <p className="text-base md:text-lg text-slate-600 max-w-2xl mx-auto mb-12 leading-relaxed text-balance">
            대기업만 누리던 비즈니스 인텔리전스,
            <br className="hidden sm:block" />
            이제 당신의 사업에도.
          </p>

          {/* CTA Button */}
          <Link
            href="/services"
            className="inline-flex items-center gap-2 px-8 py-4 bg-midnight-slate text-paper-white text-sm font-medium tracking-wide rounded-none hover:bg-midnight-slate/90 transition-all duration-200 group"
          >
            서비스 알아보기
            <ArrowUpRight
              size={16}
              className="transition-transform duration-200 group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
            />
          </Link>
        </div>

        {/* Scroll Indicator */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2">
          <div className="w-px h-12 bg-slate-200 animate-pulse" />
        </div>
      </section>

      {/* Value Proposition Section */}
      <section className="py-24 lg:py-32 px-6 bg-pure-white">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16 lg:mb-20">
            <p className="text-xs tracking-[0.3em] uppercase text-slate-400 mb-4">
              Core Values
            </p>
            <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold text-midnight-slate text-balance">
              왜 선익인가
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 lg:gap-12">
            {/* Card 1 */}
            <div className="group p-8 lg:p-10 border border-slate-200 hover:border-midnight-slate/20 transition-colors duration-300">
              <div className="mb-6">
                <ShieldCheck
                  size={28}
                  strokeWidth={1.5}
                  className="text-midnight-slate"
                />
              </div>
              <h3 className="text-lg font-semibold text-midnight-slate mb-3">
                정보 비대칭 파괴
              </h3>
              <p className="text-sm text-slate-600 leading-relaxed">
                대기업과 같은 수준의 시장 정보를 제공합니다. 더 이상 정보의
                격차로 인해 불리한 위치에서 경쟁하지 않아도 됩니다.
              </p>
            </div>

            {/* Card 2 */}
            <div className="group p-8 lg:p-10 border border-slate-200 hover:border-midnight-slate/20 transition-colors duration-300">
              <div className="mb-6">
                <Brain
                  size={28}
                  strokeWidth={1.5}
                  className="text-midnight-slate"
                />
              </div>
              <h3 className="text-lg font-semibold text-midnight-slate mb-3">
                AI 네이티브 분석
              </h3>
              <p className="text-sm text-slate-600 leading-relaxed">
                최신 AI 기술로 실시간 인사이트를 도출합니다. 수작업으로 며칠이
                걸리던 분석을, 즉시 받아보세요.
              </p>
            </div>

            {/* Card 3 */}
            <div className="group p-8 lg:p-10 border border-slate-200 hover:border-midnight-slate/20 transition-colors duration-300">
              <div className="mb-6">
                <Target
                  size={28}
                  strokeWidth={1.5}
                  className="text-midnight-slate"
                />
              </div>
              <h3 className="text-lg font-semibold text-midnight-slate mb-3">
                실행 가능한 전략
              </h3>
              <p className="text-sm text-slate-600 leading-relaxed">
                분석에서 끝나지 않고, 당장 적용할 수 있는 전략까지 제공합니다.
                인사이트를 행동으로 연결합니다.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Social Proof Section (Placeholder) */}
      <section className="py-20 lg:py-24 px-6 bg-paper-white">
        <div className="max-w-6xl mx-auto text-center">
          <p className="text-xs tracking-[0.3em] uppercase text-slate-400 mb-4">
            Trusted By
          </p>
          <p className="text-sm text-slate-400">
            클라이언트 후기가 곧 업데이트됩니다.
          </p>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 lg:py-32 px-6 bg-midnight-slate">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold text-pure-white mb-6 text-balance">
            정보의 힘을 경험하세요.
          </h2>
          <p className="text-sm md:text-base text-slate-400 mb-12 max-w-xl mx-auto leading-relaxed">
            선익과 함께라면, 당신도 먼저 알고 먼저 이길 수 있습니다.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href="https://instagram.com/seonik_official"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2 px-8 py-4 border border-white/20 text-pure-white text-sm font-medium tracking-wide hover:bg-white/5 transition-all duration-200"
            >
              <Instagram size={16} />
              인스타그램 팔로우
            </a>
            <Link
              href="/contact"
              className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-pure-white text-midnight-slate text-sm font-medium tracking-wide hover:bg-paper-white transition-all duration-200"
            >
              <Mail size={16} />
              서비스 문의하기
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}

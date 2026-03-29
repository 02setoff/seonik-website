import type { Metadata } from "next";
import {
  FileText,
  BarChart3,
  Users,
  ArrowUpRight,
} from "lucide-react";

export const metadata: Metadata = {
  title: "서비스 | 선익 SEONIK",
  description:
    "비즈니스 인텔리전스를 누구나 접근 가능하게. 인사이트 콘텐츠, 프리미엄 리서치, 1:1 컨설팅.",
};

const tiers = [
  {
    tier: "TIER 1",
    name: "인사이트 콘텐츠",
    description: "비즈니스 인사이트를 쉽게 접할 수 있는 콘텐츠",
    features: [
      "비즈니스 모델 해부 시리즈",
      "시장 트렌드 분석 리포트",
      "경쟁사 벤치마킹 케이스",
    ],
    cta: "Coming Soon",
    ctaLink: null,
    icon: FileText,
    comingSoon: true,
  },
  {
    tier: "TIER 2",
    name: "프리미엄 리서치",
    description: "심층적인 분석과 맞춤형 인사이트",
    features: [
      "월간 심층 분석 리포트",
      "산업별 맞춤 인사이트",
      "전략 프레임워크 템플릿",
    ],
    cta: "Coming Soon",
    ctaLink: null,
    icon: BarChart3,
    comingSoon: true,
  },
  {
    tier: "TIER 3",
    name: "1:1 컨설팅",
    description: "전문가와 함께하는 맞춤 전략 수립",
    features: [
      "맞춤형 시장 진입 전략",
      "경쟁 분석 및 포지셔닝",
      "성장 전략 수립",
    ],
    cta: "Coming Soon",
    ctaLink: null,
    icon: Users,
    comingSoon: true,
  },
];

export default function ServicesPage() {
  return (
    <div className="page-transition">
      {/* Hero */}
      <section className="pt-32 lg:pt-40 pb-20 lg:pb-24 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <p className="text-xs tracking-[0.3em] uppercase text-slate-400 mb-6">
            Services
          </p>
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-midnight-slate mb-6 leading-tight text-balance">
            선익의 서비스
          </h1>
          <p className="text-base md:text-lg text-slate-600 max-w-2xl mx-auto leading-relaxed text-balance">
            비즈니스 인텔리전스를
            <br className="hidden sm:block" />
            누구나 접근 가능하게.
          </p>
        </div>
      </section>

      {/* Service Tiers */}
      <section className="pb-24 lg:pb-32 px-6">
        <div className="max-w-5xl mx-auto space-y-6 lg:space-y-8">
          {tiers.map((tier) => {
            const Icon = tier.icon;
            return (
              <div
                key={tier.tier}
                className="border border-slate-200 bg-pure-white p-8 md:p-10 lg:p-12 hover:border-midnight-slate/20 transition-colors duration-300"
              >
                <div className="flex flex-col md:flex-row md:items-start gap-8">
                  {/* Left: Tier Info */}
                  <div className="md:w-1/3">
                    <div className="flex items-center gap-3 mb-4">
                      <Icon
                        size={24}
                        strokeWidth={1.5}
                        className="text-midnight-slate"
                      />
                      <span className="text-xs tracking-[0.2em] uppercase text-slate-400 font-medium">
                        {tier.tier}
                      </span>
                    </div>
                    <h3 className="text-xl md:text-2xl font-bold text-midnight-slate mb-2">
                      {tier.name}
                    </h3>
                    <p className="text-sm text-slate-600">{tier.description}</p>
                  </div>

                  {/* Right: Features & CTA */}
                  <div className="md:w-2/3">
                    <ul className="space-y-3 mb-8">
                      {tier.features.map((feature) => (
                        <li
                          key={feature}
                          className="flex items-start gap-3 text-sm text-slate-600"
                        >
                          <span className="w-1 h-1 rounded-full bg-midnight-slate mt-2 flex-shrink-0" />
                          {feature}
                        </li>
                      ))}
                    </ul>

                    <span className="inline-flex items-center gap-2 text-sm font-medium text-slate-400">
                      {tier.cta}
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* Bottom CTA */}
      <section className="py-20 lg:py-24 px-6 bg-midnight-slate">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-2xl md:text-3xl font-bold text-pure-white mb-4 text-balance">
            서비스 출시 소식을 가장 먼저 받아보세요.
          </h2>
          <p className="text-sm text-slate-400 mb-8">
            선익에서 최신 브리핑을 만나보세요.
          </p>
        </div>
      </section>
    </div>
  );
}

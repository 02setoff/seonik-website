"use client";

import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";

export type AboutKey = "mission" | "vision" | "company" | "slogan" | "history";

interface Props {
  open: AboutKey | null;
  onClose: () => void;
}

const TABS: { key: AboutKey; label: string; code: string }[] = [
  { key: "mission",  label: "미션",   code: "OUR MISSION"  },
  { key: "vision",   label: "비전",   code: "OUR VISION"   },
  { key: "company",  label: "회사명", code: "COMPANY NAME" },
  { key: "slogan",   label: "슬로건", code: "SLOGAN"       },
  { key: "history",  label: "연혁",   code: "MILESTONES"   },
];

/* ─── 공통 스타일 ─── */
const bodyText: React.CSSProperties = {
  fontSize: "14px", fontFamily: "'Pretendard', sans-serif",
  color: "var(--text-secondary)", lineHeight: "1.85", marginBottom: "14px",
};
const callout: React.CSSProperties = {
  padding: "16px 20px", borderLeft: "3px solid var(--text-primary)",
  backgroundColor: "var(--bg-subtle)", marginBottom: "14px",
};

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div style={{ marginBottom: "28px" }}>
      <h2 style={{
        fontSize: "11px", fontFamily: "Inter, sans-serif", fontWeight: 700,
        letterSpacing: "0.12em", textTransform: "uppercase",
        color: "var(--text-primary)", borderBottom: "2px solid var(--text-primary)",
        paddingBottom: "7px", marginBottom: "16px",
      }}>{title}</h2>
      {children}
    </div>
  );
}

/* ─── 각 섹션 콘텐츠 ─── */
function MissionContent() {
  return (
    <div>
      <div style={{ padding: "24px 28px", backgroundColor: "#0F172A", marginBottom: "28px" }}>
        <p style={{ fontSize: "10px", fontFamily: "Inter", color: "#64748B", letterSpacing: "0.15em", marginBottom: "14px" }}>MISSION STATEMENT</p>
        <blockquote style={{ fontSize: "17px", fontFamily: "'Pretendard'", fontWeight: 700, color: "white", lineHeight: "1.75", margin: 0 }}>
          "정보 비대칭의 장벽을 파괴하여,<br />
          대한민국의 저성장을 돌파할<br />
          실행가들을 무장시킨다."
        </blockquote>
      </div>
      <Section title="정보 비대칭의 잔혹한 현실">
        <p style={bodyText}>현대 비즈니스는 총성 없는 전쟁터입니다. 대기업은 맥킨지·BCG 같은 컨설팅 펌에 수억~수십억 원을 지불하고 글로벌 시장의 미세한 진동조차 감지하여 데이터 기반의 의사결정을 내립니다.</p>
        <div style={callout}>
          <p style={{ ...bodyText, fontWeight: 700, color: "var(--text-primary)", marginBottom: "6px" }}>1인 사업자·소규모 창업가는?</p>
          <p style={{ ...bodyText, margin: 0 }}>구조적으로 이와 같은 수준의 전략 컨설팅에 접근하지 못합니다. 결국 유튜브, 파편화된 블로그, 그리고 "감"에 의존하여 회사의 명운이 걸린 결정을 내립니다.</p>
        </div>
      </Section>
      <Section title="4가지 정보 비대칭 장벽">
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px" }}>
          {[
            { no: "01", title: "비용의 장벽", desc: "고급 리포트에 접근하기 위한 압도적인 자본의 격차" },
            { no: "02", title: "언어의 장벽", desc: "실리콘밸리·런던 등 영어권 중심으로 쏟아지는 원천 데이터" },
            { no: "03", title: "시간의 장벽", desc: "당장 오늘의 생존을 위해 뛰느라 리서치에 투자할 물리적 시간 부족" },
            { no: "04", title: "해석의 장벽", desc: "정보를 모았어도 내 사업에 어떻게 적용할지 모르는 막막함" },
          ].map(item => (
            <div key={item.no} style={{ border: "1px solid var(--border)", padding: "14px", backgroundColor: "var(--bg-subtle)" }}>
              <p style={{ fontSize: "10px", fontFamily: "Inter", color: "var(--text-disabled)", fontWeight: 700, marginBottom: "6px" }}>{item.no}</p>
              <p style={{ fontSize: "13px", fontFamily: "'Pretendard'", fontWeight: 700, color: "var(--text-primary)", marginBottom: "4px" }}>{item.title}</p>
              <p style={{ fontSize: "12px", fontFamily: "'Pretendard'", color: "var(--text-muted)", lineHeight: "1.6", margin: 0 }}>{item.desc}</p>
            </div>
          ))}
        </div>
      </Section>
      <Section title="개선이 아닌 파괴, 그리고 무장">
        <p style={bodyText}>선익은 이 장벽을 단순히 줄이는 수준에 머물지 않습니다. 우리의 미션은 이 장벽을 철저히 <strong style={{ color: "var(--text-primary)" }}>파괴(Destroy)</strong>하는 것입니다.</p>
        <p style={{ ...bodyText, margin: 0 }}>선익은 실행가들을 철저히 <strong style={{ color: "var(--text-primary)" }}>무장(Arming)</strong>시킵니다. 정보는 곧 무기이며, 분석은 전략이 되고, 실행 가이드는 전술이 됩니다.</p>
      </Section>
    </div>
  );
}

function VisionContent() {
  return (
    <div>
      <div style={{ padding: "24px 28px", backgroundColor: "#0F172A", marginBottom: "28px" }}>
        <p style={{ fontSize: "10px", fontFamily: "Inter", color: "#64748B", letterSpacing: "0.15em", marginBottom: "14px" }}>VISION STATEMENT</p>
        <blockquote style={{ fontSize: "17px", fontFamily: "'Pretendard'", fontWeight: 700, color: "white", lineHeight: "1.75", margin: 0 }}>
          "전 세계의 창업 정보를 누구보다 빠르게<br />
          수집하고 브리핑하는<br />
          제1의 민간 정보기관."
        </blockquote>
      </div>
      <Section title="전 세계 데이터를 향한 첩보전">
        <p style={bodyText}>최신 스타트업, 마이크로 SaaS, 비즈니스 트렌드는 실리콘밸리를 비롯한 영어권 커뮤니티에서 가장 먼저 폭발합니다. 한국의 사업자들은 언어·시간·맥락 해석의 장벽 때문에 이를 직접 활용하기 어렵습니다.</p>
      </Section>
      <Section title="누구보다 빠른 속도 — AI 네이티브 운영">
        <div style={callout}>
          <p style={{ ...bodyText, margin: 0 }}><strong style={{ color: "var(--text-primary)" }}>"창업·마이크로 SaaS·AI 비즈니스"</strong>라는 뾰족한 니치(Niche)에 집중하여, 대형 기관보다 훨씬 빠르게 글로벌 소스를 모니터링하고 번역하며 패턴을 포착합니다.</p>
        </div>
      </Section>
      <Section title="성장 로드맵">
        <div style={{ display: "flex", flexDirection: "column" }}>
          {[
            { phase: "PHASE 01", title: "브리핑 & 창업 AI", desc: "글로벌 창업 정보 브리핑 채널 정착 및 핵심 독자층 확보." },
            { phase: "PHASE 02", title: "커뮤니티 & 벤처스", desc: "독자 기반 창업가 커뮤니티 구축. 유망 창업팀 발굴 및 벤처 투자 파트너십." },
            { phase: "PHASE 03", title: "재단", desc: "민간 싱크탱크로서의 사회적 역할 수행. 창업 생태계 지원 제도화." },
          ].map((item, i, arr) => (
            <div key={item.phase} style={{ display: "flex", gap: "14px" }}>
              <div style={{ display: "flex", flexDirection: "column", alignItems: "center", width: "10px" }}>
                <div style={{ width: "10px", height: "10px", borderRadius: "50%", backgroundColor: "var(--text-primary)", flexShrink: 0, marginTop: "18px" }} />
                {i < arr.length - 1 && <div style={{ width: "2px", flex: 1, backgroundColor: "var(--border)", minHeight: "24px" }} />}
              </div>
              <div style={{ padding: "14px 0 18px", flex: 1, paddingLeft: "6px" }}>
                <span style={{ fontSize: "10px", fontFamily: "Inter", fontWeight: 700, color: "var(--text-disabled)", letterSpacing: "0.1em" }}>{item.phase}</span>
                <p style={{ fontSize: "14px", fontFamily: "'Pretendard'", fontWeight: 700, color: "var(--text-primary)", margin: "3px 0" }}>{item.title}</p>
                <p style={{ fontSize: "12px", fontFamily: "'Pretendard'", color: "var(--text-muted)", lineHeight: "1.6", margin: 0 }}>{item.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </Section>
    </div>
  );
}

function CompanyContent() {
  return (
    <div>
      <div style={{ padding: "32px", backgroundColor: "#0F172A", marginBottom: "28px", textAlign: "center" }}>
        <p style={{ fontSize: "52px", fontFamily: "'Pretendard'", fontWeight: 800, color: "white", lineHeight: 1, marginBottom: "14px" }}>선익</p>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "14px", marginBottom: "10px" }}>
          <span style={{ fontSize: "22px", fontFamily: "'Pretendard'", fontWeight: 700, color: "#475569" }}>先益</span>
          <span style={{ color: "#334155" }}>·</span>
          <span style={{ fontSize: "18px", fontFamily: "Inter", fontWeight: 600, color: "#475569", letterSpacing: "0.25em" }}>SEONIK</span>
        </div>
        <p style={{ fontSize: "12px", fontFamily: "Inter", color: "#334155", fontStyle: "italic", margin: 0 }}>[선·익] — seon·ik</p>
      </div>
      <Section title="이름의 의미">
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px", marginBottom: "16px" }}>
          {[
            { char: "先", label: "FIRST",   ko: "먼저",   desc: "남보다 먼저 알고, 먼저 움직인다" },
            { char: "益", label: "BENEFIT", ko: "이롭다", desc: "알면 이롭고, 이기고, 성장한다" },
          ].map(item => (
            <div key={item.char} style={{ border: "1px solid var(--border)", padding: "20px", textAlign: "center", backgroundColor: "var(--bg-subtle)" }}>
              <p style={{ fontSize: "32px", fontFamily: "'Pretendard'", fontWeight: 800, color: "var(--text-primary)", marginBottom: "6px" }}>{item.char}</p>
              <p style={{ fontSize: "10px", fontFamily: "Inter", color: "var(--text-placeholder)", letterSpacing: "0.1em", marginBottom: "4px" }}>{item.label}</p>
              <p style={{ fontSize: "13px", fontFamily: "'Pretendard'", fontWeight: 600, color: "var(--text-primary)", marginBottom: "3px" }}>{item.ko}</p>
              <p style={{ fontSize: "11px", fontFamily: "'Pretendard'", color: "var(--text-muted)", lineHeight: "1.6", margin: 0 }}>{item.desc}</p>
            </div>
          ))}
        </div>
        <div style={callout}>
          <p style={{ ...bodyText, margin: 0 }}><strong>先益(선익)</strong>은 "먼저 알아야 먼저 이긴다"는 철학을 담고 있습니다. 정보의 시간차가 곧 비즈니스의 승패를 결정짓는 시대에, 선익은 모든 실행가가 <strong>先</strong>을 쥘 수 있도록 합니다.</p>
        </div>
      </Section>
      <Section title="영문 표기 — SEONIK">
        <p style={{ ...bodyText, margin: 0 }}>영문 표기 <strong style={{ fontFamily: "Inter" }}>SEONIK</strong>은 한국어 발음 "선익"을 로마자 표기한 것으로, 국제 시장에서도 직관적으로 읽힐 수 있도록 설계했습니다.</p>
      </Section>
    </div>
  );
}

function SloganContent() {
  return (
    <div>
      <div style={{ padding: "32px", backgroundColor: "#0F172A", textAlign: "center", marginBottom: "20px" }}>
        <p style={{ fontSize: "10px", fontFamily: "Inter", color: "#64748B", letterSpacing: "0.15em", marginBottom: "14px" }}>OFFICIAL SLOGAN</p>
        <p style={{ fontSize: "22px", fontFamily: "'Pretendard'", fontWeight: 800, color: "white", lineHeight: "1.5", marginBottom: "8px" }}>
          앞서나가는 정보로<br />실행가들을 이롭게
        </p>
        <p style={{ fontSize: "12px", fontFamily: "Inter", color: "#475569", margin: 0, letterSpacing: "0.1em" }}>先益 (SEONIK)</p>
      </div>
      <div style={{ padding: "32px", border: "2px solid var(--text-primary)", textAlign: "center", backgroundColor: "var(--bg-card)", marginBottom: "28px" }}>
        <p style={{ fontSize: "10px", fontFamily: "Inter", color: "var(--text-placeholder)", letterSpacing: "0.15em", marginBottom: "14px" }}>MARKETING SLOGAN</p>
        <p style={{ fontSize: "26px", fontFamily: "Inter", fontWeight: 800, color: "var(--text-primary)", letterSpacing: "-0.01em", lineHeight: 1.2, marginBottom: "10px" }}>
          Know First,<br />Win First.
        </p>
        <p style={{ fontSize: "13px", fontFamily: "'Pretendard'", color: "var(--text-muted)", margin: 0 }}>먼저 아는 자가 이긴다</p>
      </div>
      <Section title="슬로건에 담긴 철학">
        {[
          { ko: "앞서나가는 정보로", en: "Know First", desc: "정보의 시간차가 곧 비즈니스의 승패를 결정합니다. 경쟁자보다 단 하루 먼저 시장의 변화를 감지하면 전략적 우위를 선점할 수 있습니다." },
          { ko: "실행가들을 이롭게", en: "Win First",  desc: "지식은 실행으로 이어질 때 의미를 갖습니다. 선익의 인텔리전스는 즉시 사업에 적용할 수 있는 실행 가이드를 제공합니다." },
        ].map(item => (
          <div key={item.ko} style={{ display: "flex", border: "1px solid var(--border)", backgroundColor: "var(--bg-card)", marginBottom: "10px" }}>
            <div style={{ width: "3px", backgroundColor: "var(--text-primary)", flexShrink: 0 }} />
            <div style={{ padding: "16px 18px", flex: 1 }}>
              <div style={{ display: "flex", gap: "10px", alignItems: "center", marginBottom: "6px" }}>
                <span style={{ fontSize: "14px", fontFamily: "'Pretendard'", fontWeight: 700, color: "var(--text-primary)" }}>{item.ko}</span>
                <span style={{ fontSize: "11px", fontFamily: "Inter", color: "var(--text-placeholder)" }}>= {item.en}</span>
              </div>
              <p style={{ fontSize: "12px", fontFamily: "'Pretendard'", color: "var(--text-muted)", lineHeight: "1.65", margin: 0 }}>{item.desc}</p>
            </div>
          </div>
        ))}
      </Section>
    </div>
  );
}

function HistoryContent() {
  const milestones = [
    { date: "2026.03", title: "선익 창업", desc: "정보 비대칭 해소를 목표로 선익(SEONIK) 창업. AI 네이티브 비즈니스 인텔리전스 브리핑 서비스 개발 시작.", tag: "FOUNDED" },
    { date: "2026.03", title: "선익 웹사이트 런칭", desc: "선익 인텔리전스 브리핑 플랫폼 정식 오픈. 이메일 인증 기반 회원 서비스 시작.", tag: "LAUNCH" },
  ];
  return (
    <div>
      <Section title="주요 마일스톤">
        <div>
          {milestones.map((item, i) => (
            <div key={i} style={{ display: "flex", gap: "16px" }}>
              <div style={{ display: "flex", flexDirection: "column", alignItems: "center", width: "12px" }}>
                <div style={{ width: "12px", height: "12px", borderRadius: "50%", backgroundColor: "var(--text-primary)", border: "2px solid var(--modal-bg)", boxShadow: "0 0 0 2px var(--text-primary)", flexShrink: 0, marginTop: "16px" }} />
                {i < milestones.length - 1 && <div style={{ width: "2px", flex: 1, backgroundColor: "var(--border)", minHeight: "32px" }} />}
              </div>
              <div style={{ paddingBottom: i < milestones.length - 1 ? "24px" : "0", flex: 1, paddingLeft: "8px" }}>
                <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "5px" }}>
                  <span style={{ fontSize: "12px", fontFamily: "Inter", fontWeight: 700, color: "var(--text-primary)" }}>{item.date}</span>
                  <span style={{ fontSize: "10px", fontFamily: "Inter", fontWeight: 700, color: "var(--text-placeholder)", letterSpacing: "0.08em", backgroundColor: "var(--bg-subtle)", padding: "2px 7px" }}>{item.tag}</span>
                </div>
                <p style={{ fontSize: "15px", fontFamily: "'Pretendard'", fontWeight: 700, color: "var(--text-primary)", marginBottom: "5px" }}>{item.title}</p>
                <p style={{ fontSize: "13px", fontFamily: "'Pretendard'", color: "var(--text-muted)", lineHeight: "1.7", margin: 0 }}>{item.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </Section>
      <div style={{ padding: "22px 26px", backgroundColor: "#0F172A" }}>
        <p style={{ fontSize: "10px", fontFamily: "Inter", color: "#64748B", letterSpacing: "0.15em", marginBottom: "10px" }}>CURRENT STATUS</p>
        <p style={{ fontSize: "15px", fontFamily: "'Pretendard'", fontWeight: 700, color: "white", marginBottom: "6px" }}>지금, 선익은 성장 중입니다.</p>
        <p style={{ fontSize: "13px", fontFamily: "'Pretendard'", color: "#64748B", lineHeight: "1.8", margin: 0 }}>초기 단계로서 핵심 독자 커뮤니티를 구축하고 인텔리전스 브리핑의 질을 높이는 데 집중하고 있습니다.</p>
      </div>
    </div>
  );
}

const CONTENT_MAP: Record<AboutKey, React.FC> = {
  mission: MissionContent,
  vision:  VisionContent,
  company: CompanyContent,
  slogan:  SloganContent,
  history: HistoryContent,
};

/* ─── 메인 오버레이 ─── */
export default function AboutOverlay({ open, onClose }: Props) {
  const backdropMouseDown = useRef(false);
  const [activeTab, setActiveTab] = useState<AboutKey | null>(open);

  // open prop이 바뀌면 activeTab 동기화
  useEffect(() => {
    if (open) setActiveTab(open);
  }, [open]);

  // ESC 닫기
  useEffect(() => {
    if (!open) return;
    const handler = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); };
    document.addEventListener("keydown", handler);
    return () => document.removeEventListener("keydown", handler);
  }, [open, onClose]);

  // 배경 스크롤 잠금
  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [open]);

  const ContentComponent = activeTab ? CONTENT_MAP[activeTab] : null;
  const activeInfo = TABS.find(t => t.key === activeTab);

  return (
    <AnimatePresence>
      {open && (
        /* ── 전체 배경 딤 + 블러 ── */
        <motion.div
          key="about-backdrop"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          onMouseDown={(e) => { backdropMouseDown.current = e.target === e.currentTarget; }}
          onClick={(e) => { if (backdropMouseDown.current && e.target === e.currentTarget) onClose(); }}
          style={{
            position: "fixed", inset: 0, zIndex: 300,
            display: "flex", alignItems: "center", justifyContent: "center",
            padding: "clamp(16px, 4vw, 40px)",
            backgroundColor: "rgba(15, 23, 42, 0.6)",
            backdropFilter: "blur(4px)",
            WebkitBackdropFilter: "blur(4px)",
          }}
        >
          {/* ── 모달 박스 ── */}
          <motion.div
            key="about-modal"
            initial={{ opacity: 0, scale: 0.96, y: 12 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.96, y: 12 }}
            transition={{ duration: 0.22, ease: [0.22, 1, 0.36, 1] }}
            onClick={(e) => e.stopPropagation()}
            style={{
              width: "min(620px, 100%)",
              maxHeight: "min(820px, 90vh)",
              backgroundColor: "var(--modal-bg)",
              display: "flex",
              flexDirection: "column",
              boxShadow: "0 20px 60px rgba(0,0,0,0.25)",
              overflow: "hidden",
            }}
          >
            {/* 모달 헤더 */}
            <div style={{
              display: "flex", alignItems: "flex-start", justifyContent: "space-between",
              padding: "22px 24px 18px",
              borderBottom: "1px solid var(--border)",
              flexShrink: 0,
            }}>
              <div>
                <p style={{ fontSize: "10px", fontFamily: "Inter", color: "var(--text-placeholder)", letterSpacing: "0.15em", marginBottom: "5px" }}>
                  {activeInfo?.code}
                </p>
                <h1 style={{ fontSize: "20px", fontFamily: "'Pretendard'", fontWeight: 800, color: "var(--text-primary)" }}>
                  {activeInfo?.label}
                </h1>
              </div>
              <button
                onClick={onClose}
                aria-label="닫기"
                style={{
                  background: "none", border: "none", cursor: "pointer",
                  color: "var(--text-placeholder)", padding: "2px",
                  transition: "color 0.15s", flexShrink: 0,
                }}
                onMouseEnter={e => { (e.currentTarget as HTMLButtonElement).style.color = "var(--text-primary)"; }}
                onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.color = "var(--text-placeholder)"; }}
              >
                <X size={20} />
              </button>
            </div>

            {/* 탭 네비 */}
            <div className="about-modal-tabs" style={{
              display: "flex",
              borderBottom: "1px solid var(--border)",
              flexShrink: 0, overflowX: "auto",
            }}>
              {TABS.map(tab => (
                <button
                  key={tab.key}
                  onClick={() => setActiveTab(tab.key)}
                  style={{
                    padding: "10px 18px", background: "none", border: "none", cursor: "pointer",
                    fontSize: "13px", fontFamily: "'Pretendard'",
                    fontWeight: activeTab === tab.key ? 700 : 400,
                    color: activeTab === tab.key ? "var(--text-primary)" : "var(--text-placeholder)",
                    borderBottom: activeTab === tab.key ? "2px solid var(--text-primary)" : "2px solid transparent",
                    marginBottom: "-1px", whiteSpace: "nowrap", transition: "all 0.15s",
                  }}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            {/* 스크롤 본문 */}
            <div className="about-modal-body" style={{ flex: 1, overflowY: "auto", padding: "24px 24px 28px" }}>
              {ContentComponent && <ContentComponent />}

              {/* 모달 푸터 */}
              <div style={{ borderTop: "1px solid var(--border-light)", paddingTop: "16px", marginTop: "4px" }}>
                <p style={{ fontSize: "11px", color: "var(--text-placeholder)", fontFamily: "Inter", textAlign: "center" }}>
                  先益 — 앞서나가는 정보로 실행가들을 이롭게
                </p>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

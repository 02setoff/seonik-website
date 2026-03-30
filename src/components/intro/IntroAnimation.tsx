"use client";

import { motion } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import { ChevronDown, Sun, Moon } from "lucide-react";
import { useTheme } from "@/components/ThemeProvider";
import AboutOverlay, { AboutKey } from "./AboutOverlay";

const EASE: [number, number, number, number] = [0.22, 1, 0.36, 1];

const ABOUT_ITEMS: { key: AboutKey; label: string }[] = [
  { key: "mission",  label: "미션"   },
  { key: "vision",   label: "비전"   },
  { key: "company",  label: "회사명" },
  { key: "slogan",   label: "슬로건" },
  { key: "history",  label: "연혁"   },
];

const ECOSYSTEM = ["브리핑", "창업 AI", "커뮤니티", "선익 벤처스", "선익 재단"];

// 스크롤 트리거 Fade-up 래퍼
function FadeUp({
  children, delay = 0, style = {},
}: {
  children: React.ReactNode; delay?: number; style?: React.CSSProperties;
}) {
  return (
    <motion.div
      style={style}
      initial={{ opacity: 0, y: 36 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ duration: 0.85, delay, ease: EASE }}
    >
      {children}
    </motion.div>
  );
}

interface IntroAnimationProps {
  onEnterFeed?: () => void;
  isLoggedIn?: boolean;
  onLoginClick?: () => void;
  onSignupClick?: () => void;
}

export default function IntroAnimation({
  onLoginClick, onSignupClick,
}: IntroAnimationProps) {
  const { theme, toggleTheme } = useTheme();
  const [aboutOpen, setAboutOpen]       = useState<AboutKey | null>(null);
  const [aboutDropdown, setAboutDropdown] = useState(false);
  const aboutRef = useRef<HTMLDivElement>(null);

  // 외부 클릭 시 About 드롭다운 닫기
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (aboutRef.current && !aboutRef.current.contains(e.target as Node))
        setAboutDropdown(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  // about-tab-change 이벤트 수신
  useEffect(() => {
    const handler = (e: Event) => setAboutOpen((e as CustomEvent<AboutKey>).detail);
    window.addEventListener("about-tab-change", handler);
    return () => window.removeEventListener("about-tab-change", handler);
  }, []);

  /* ── 공통 스타일 ── */
  const navLink: React.CSSProperties = {
    background: "none", border: "none", cursor: "pointer",
    fontSize: "14px", fontFamily: "'Pretendard', sans-serif",
    fontWeight: 500, color: "var(--text-muted)",
    padding: "5px 10px", textDecoration: "none",
    transition: "color 0.15s",
  };

  return (
    <>
      {/* ══════════════════════════════════════════
          FIXED HEADER
      ══════════════════════════════════════════ */}
      <header style={{
        position: "fixed", top: 0, left: 0, right: 0, zIndex: 200,
        height: "64px", display: "flex", alignItems: "center",
        justifyContent: "space-between",
        padding: "0 clamp(16px, 4vw, 40px)",
        backgroundColor: "var(--header-bg)",
        borderBottom: "1px solid var(--header-border)",
        backdropFilter: "blur(12px)",
      }}>

        {/* 로고 */}
        <div style={{ display: "inline-flex", flexDirection: "column", alignItems: "stretch", gap: "3px" }}>
          <span style={{ fontSize: "22px", fontFamily: "'Pretendard', sans-serif", fontWeight: 800, color: "var(--text-primary)", lineHeight: 1, letterSpacing: "-0.02em" }}>선익</span>
          <span style={{ fontSize: "9px", fontFamily: "Inter, sans-serif", fontWeight: 700, color: "var(--text-placeholder)", lineHeight: 1, letterSpacing: "0.05em", textAlign: "justify", textAlignLast: "justify" } as React.CSSProperties}>SEONIK</span>
        </div>

        {/* 데스크탑 네비 */}
        <div className="hidden md:flex items-center gap-1">
          {/* About 드롭다운 */}
          <div ref={aboutRef} style={{ position: "relative" }}>
            <button
              onClick={() => setAboutDropdown(v => !v)}
              style={navLink}
              onMouseEnter={e => { (e.currentTarget as HTMLButtonElement).style.color = "var(--text-primary)"; }}
              onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.color = "var(--text-muted)"; }}
            >About</button>
            {aboutDropdown && (
              <div style={{
                position: "absolute", top: "calc(100% + 6px)", left: 0,
                backgroundColor: "var(--bg-card)", border: "1px solid var(--border)",
                boxShadow: "0 8px 32px rgba(0,0,0,0.12)", zIndex: 300,
                padding: "5px 0", minWidth: "100px",
              }}>
                {ABOUT_ITEMS.map(item => (
                  <button key={item.key}
                    onClick={() => { setAboutOpen(item.key); setAboutDropdown(false); }}
                    style={{
                      display: "block", width: "100%", padding: "9px 16px",
                      fontSize: "13px", fontFamily: "'Pretendard', sans-serif",
                      color: "var(--text-secondary)", background: "none", border: "none",
                      cursor: "pointer", textAlign: "left", transition: "background 0.1s, color 0.1s",
                    }}
                    onMouseEnter={e => { (e.currentTarget as HTMLButtonElement).style.backgroundColor = "var(--bg-hover)"; (e.currentTarget as HTMLButtonElement).style.color = "var(--text-primary)"; }}
                    onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.backgroundColor = "transparent"; (e.currentTarget as HTMLButtonElement).style.color = "var(--text-secondary)"; }}
                  >{item.label}</button>
                ))}
              </div>
            )}
          </div>

          {/* 다크모드 토글 */}
          <button
            onClick={toggleTheme}
            style={{ ...navLink, padding: "6px 8px" }}
            aria-label={theme === "dark" ? "라이트 모드" : "다크 모드"}
            onMouseEnter={e => { (e.currentTarget as HTMLButtonElement).style.color = "var(--text-primary)"; }}
            onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.color = "var(--text-muted)"; }}
          >
            {theme === "dark" ? <Sun size={16} strokeWidth={2} /> : <Moon size={16} strokeWidth={2} />}
          </button>

          {/* 로그인 */}
          <button onClick={onLoginClick} style={navLink}
            onMouseEnter={e => { (e.currentTarget as HTMLButtonElement).style.color = "var(--text-primary)"; }}
            onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.color = "var(--text-muted)"; }}
          >로그인</button>

          {/* 회원가입 */}
          <button onClick={onSignupClick} style={{
            padding: "7px 18px", fontSize: "13px",
            fontFamily: "'Pretendard', sans-serif", fontWeight: 600,
            backgroundColor: "var(--text-primary)", color: "var(--bg-primary)",
            border: "none", borderRadius: "2px", cursor: "pointer", transition: "opacity 0.15s",
          }}
            onMouseEnter={e => { (e.currentTarget as HTMLButtonElement).style.opacity = "0.82"; }}
            onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.opacity = "1"; }}
          >회원가입</button>
        </div>

        {/* 모바일 네비 */}
        <div className="flex md:hidden items-center gap-2">
          <button onClick={onLoginClick}
            style={{ background: "none", border: "none", cursor: "pointer", fontSize: "13px", fontFamily: "'Pretendard'", color: "var(--text-muted)", padding: "5px 8px" }}>
            로그인
          </button>
          <button onClick={onSignupClick}
            style={{ padding: "6px 14px", fontSize: "12px", fontFamily: "'Pretendard'", fontWeight: 600, backgroundColor: "var(--text-primary)", color: "var(--bg-primary)", border: "none", borderRadius: "2px", cursor: "pointer" }}>
            가입
          </button>
        </div>
      </header>


      {/* ══════════════════════════════════════════
          SECTION 1 — HERO
      ══════════════════════════════════════════ */}
      <section style={{
        height: "100vh", backgroundColor: "var(--bg-primary)",
        display: "flex", alignItems: "center", justifyContent: "center",
      }}>
        <div style={{ textAlign: "center" }}>

          {/* 로고 + 구분선 + 슬로건 */}
          <div className="flex md:flex-row flex-col items-center justify-center">
            <motion.div className="flex flex-col items-center"
              initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.08, duration: 0.6, ease: EASE }}>
              <span style={{ fontSize: "48px", fontFamily: "'Pretendard', sans-serif", fontWeight: 800, letterSpacing: "0.15em", color: "var(--text-primary)", lineHeight: 1 }}>
                선 익
              </span>
              <motion.span style={{ fontSize: "27px", marginTop: "6px", fontFamily: "Inter, sans-serif", fontWeight: 600, letterSpacing: "0.22em", color: "var(--text-primary)" }}
                initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                transition={{ delay: 0.3, duration: 0.5, ease: EASE }}>
                SEONIK
              </motion.span>
            </motion.div>

            <motion.div className="hidden md:block w-px shrink-0"
              style={{ height: "60px", margin: "0 30px", backgroundColor: "var(--text-disabled)" }}
              initial={{ opacity: 0, scaleY: 0 }} animate={{ opacity: 1, scaleY: 1 }}
              transition={{ delay: 0.52, duration: 0.35, ease: EASE }} />
            <motion.div className="md:hidden h-px shrink-0"
              style={{ width: "80px", margin: "22px 0", backgroundColor: "var(--text-disabled)" }}
              initial={{ opacity: 0, scaleX: 0 }} animate={{ opacity: 1, scaleX: 1 }}
              transition={{ delay: 0.52, duration: 0.35, ease: EASE }} />

            <motion.p className="text-center md:text-left"
              style={{ fontSize: "24px", lineHeight: 1.45, fontFamily: "'Pretendard', sans-serif", fontWeight: 500, color: "var(--text-primary)" }}
              initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.62, duration: 0.55, ease: EASE }}>
              앞서나가는 정보로<br />실행가들을 이롭게
            </motion.p>
          </div>

          {/* 스크롤 유도 */}
          <motion.div style={{ marginTop: "56px", display: "flex", flexDirection: "column", alignItems: "center", gap: "8px" }}
            initial={{ opacity: 0 }} animate={{ opacity: 1 }}
            transition={{ delay: 1.3, duration: 0.5 }}>
            <span style={{ fontSize: "11px", fontFamily: "Inter, sans-serif", letterSpacing: "0.14em", color: "var(--text-disabled)" }}>SCROLL</span>
            <motion.div
              animate={{ y: [0, 8, 0] }}
              transition={{ duration: 1.8, repeat: Infinity, ease: "easeInOut" }}>
              <ChevronDown size={18} style={{ color: "var(--text-disabled)" }} />
            </motion.div>
          </motion.div>
        </div>
      </section>


      {/* ══════════════════════════════════════════
          SECTION 2 — PROBLEM (Dark)
      ══════════════════════════════════════════ */}
      <section style={{
        minHeight: "100vh", backgroundColor: "#060E1C",
        display: "flex", alignItems: "center", justifyContent: "center",
        padding: "100px clamp(28px, 8vw, 120px)",
      }}>
        <div style={{ maxWidth: "680px", width: "100%" }}>

          <FadeUp>
            <p style={{
              fontSize: "clamp(38px, 5.5vw, 68px)",
              fontFamily: "'Pretendard', sans-serif", fontWeight: 900,
              color: "#F8FAFC", letterSpacing: "-0.04em", lineHeight: 1.15, margin: 0,
            }}>
              꿈은 있었습니다.
            </p>
          </FadeUp>

          <FadeUp delay={0.15}>
            <p style={{
              fontSize: "clamp(22px, 3.2vw, 42px)",
              fontFamily: "'Pretendard', sans-serif", fontWeight: 300,
              color: "#64748B", letterSpacing: "-0.03em", lineHeight: 1.35,
              margin: "12px 0 0",
            }}>
              그런데 어디서 시작해야 할지<br />몰랐습니다.
            </p>
          </FadeUp>

          <FadeUp delay={0.3}>
            <div style={{ width: "40px", height: "2px", backgroundColor: "#EAB308", margin: "52px 0" }} />
          </FadeUp>

          <FadeUp delay={0.4}>
            <p style={{
              fontSize: "clamp(17px, 2.2vw, 26px)",
              fontFamily: "'Pretendard', sans-serif", fontWeight: 400,
              color: "#CBD5E1", lineHeight: 1.65, margin: 0,
            }}>
              창업을 꿈꾸는 사람은 많습니다.<br />
              하지만 실제로 시작하는 사람은 드뭅니다.
            </p>
          </FadeUp>

          <FadeUp delay={0.5}>
            <p style={{
              fontSize: "clamp(14px, 1.6vw, 18px)",
              fontFamily: "'Pretendard', sans-serif", fontWeight: 400,
              color: "#475569", lineHeight: 1.7, margin: "20px 0 0",
            }}>
              관심과 실행 사이. 그 간극에는 이유가 있었습니다.
            </p>
          </FadeUp>
        </div>
      </section>


      {/* ══════════════════════════════════════════
          SECTION 3 — SOLUTION (Light)
      ══════════════════════════════════════════ */}
      <section style={{
        minHeight: "100vh", backgroundColor: "var(--bg-primary)",
        display: "flex", alignItems: "center", justifyContent: "center",
        padding: "100px clamp(28px, 8vw, 120px)",
      }}>
        <div style={{ maxWidth: "680px", width: "100%" }}>

          <FadeUp>
            <p style={{
              fontSize: "clamp(32px, 4.5vw, 56px)",
              fontFamily: "'Pretendard', sans-serif", fontWeight: 900,
              color: "var(--text-primary)", letterSpacing: "-0.04em", lineHeight: 1.15, margin: 0,
            }}>
              선익은<br />그 간극을 메웁니다.
            </p>
          </FadeUp>

          <FadeUp delay={0.15}>
            <p style={{
              fontSize: "clamp(15px, 1.8vw, 20px)",
              fontFamily: "'Pretendard', sans-serif",
              color: "var(--text-muted)", lineHeight: 1.7, margin: "20px 0 0",
            }}>
              전 세계 창업 정보를 발굴·분석하고,<br />
              실행할 수 있는 형태로 전달합니다.
            </p>
          </FadeUp>

          {/* 제품 카드 */}
          <div style={{
            display: "flex", flexWrap: "wrap", gap: "20px", marginTop: "52px",
          }}>
            <FadeUp delay={0.25} style={{ flex: "1 1 260px" }}>
              <div style={{
                border: "1px solid var(--border)", padding: "32px 28px",
                height: "100%", boxSizing: "border-box",
              }}>
                <p style={{ fontSize: "10px", fontFamily: "Inter, sans-serif", letterSpacing: "0.18em", color: "#EAB308", margin: "0 0 16px", fontWeight: 700 }}>
                  BRIEFING
                </p>
                <p style={{ fontSize: "20px", fontFamily: "'Pretendard', sans-serif", fontWeight: 800, color: "var(--text-primary)", margin: "0 0 14px", letterSpacing: "-0.02em", lineHeight: 1.3 }}>
                  창업 핵심 정보<br />큐레이션 리포트
                </p>
                <p style={{ fontSize: "14px", fontFamily: "'Pretendard', sans-serif", color: "var(--text-muted)", lineHeight: 1.75, margin: 0 }}>
                  아이템 선정부터 사업 전략까지 — 흩어진 글로벌 인사이트를 실행 가능한 브리핑으로 전달합니다.
                </p>
              </div>
            </FadeUp>

            <FadeUp delay={0.38} style={{ flex: "1 1 260px" }}>
              <div style={{
                border: "1px solid var(--border)", padding: "32px 28px",
                backgroundColor: "var(--bg-subtle, #F8FAFC)",
                height: "100%", boxSizing: "border-box",
              }}>
                <p style={{ fontSize: "10px", fontFamily: "Inter, sans-serif", letterSpacing: "0.18em", color: "#EAB308", margin: "0 0 16px", fontWeight: 700 }}>
                  창업 AI &nbsp;·&nbsp; 준비 중
                </p>
                <p style={{ fontSize: "20px", fontFamily: "'Pretendard', sans-serif", fontWeight: 800, color: "var(--text-primary)", margin: "0 0 14px", letterSpacing: "-0.02em", lineHeight: 1.3 }}>
                  나만의 창업<br />엔젤투자자
                </p>
                <p style={{ fontSize: "14px", fontFamily: "'Pretendard', sans-serif", color: "var(--text-muted)", lineHeight: 1.75, margin: 0 }}>
                  아이디어를 이야기하면 분석하고 방향을 잡아줍니다. 창업의 처음부터 끝까지 함께합니다.
                </p>
              </div>
            </FadeUp>
          </div>
        </div>
      </section>


      {/* ══════════════════════════════════════════
          SECTION 4 — VISION + CTA (Dark)
      ══════════════════════════════════════════ */}
      <section style={{
        minHeight: "100vh", backgroundColor: "#060E1C",
        display: "flex", alignItems: "center", justifyContent: "center",
        padding: "100px clamp(28px, 8vw, 120px)",
      }}>
        <div style={{ maxWidth: "680px", width: "100%" }}>

          <FadeUp>
            <p style={{ fontSize: "11px", fontFamily: "Inter, sans-serif", letterSpacing: "0.2em", color: "#EAB308", margin: "0 0 28px", fontWeight: 700 }}>
              VISION
            </p>
          </FadeUp>

          <FadeUp delay={0.1}>
            <p style={{
              fontSize: "clamp(28px, 4vw, 52px)",
              fontFamily: "'Pretendard', sans-serif", fontWeight: 900,
              color: "#F8FAFC", letterSpacing: "-0.04em", lineHeight: 1.2, margin: 0,
            }}>
              저는 다시 시작하기까지<br />너무 오래 걸렸습니다.
            </p>
          </FadeUp>

          <FadeUp delay={0.22}>
            <p style={{
              fontSize: "clamp(24px, 3.5vw, 48px)",
              fontFamily: "'Pretendard', sans-serif", fontWeight: 900,
              color: "#EAB308", letterSpacing: "-0.04em", lineHeight: 1.2, margin: "10px 0 0",
            }}>
              당신은 하루 만에.
            </p>
          </FadeUp>

          <FadeUp delay={0.35}>
            <p style={{
              fontSize: "clamp(14px, 1.7vw, 19px)",
              fontFamily: "'Pretendard', sans-serif",
              color: "#94A3B8", lineHeight: 1.75, margin: "32px 0 0",
            }}>
              선익은 브리핑에서 시작해, 창업 AI·커뮤니티를 거쳐<br />
              우수한 실행가에게 직접 투자합니다.<br />
              실행가의 시작부터 성장까지, 선익이 함께합니다.
            </p>
          </FadeUp>

          {/* 에코시스템 체인 */}
          <FadeUp delay={0.45}>
            <div style={{ display: "flex", alignItems: "center", gap: "8px", marginTop: "40px", flexWrap: "wrap" }}>
              {ECOSYSTEM.map((item, i) => (
                <span key={item} style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                  <span style={{
                    fontSize: "13px", fontFamily: "Inter, sans-serif",
                    color: i === 0 ? "#F8FAFC" : "#475569",
                    fontWeight: i === 0 ? 600 : 400,
                    letterSpacing: "0.01em",
                  }}>{item}</span>
                  {i < ECOSYSTEM.length - 1 && (
                    <span style={{ color: "#334155", fontSize: "12px" }}>→</span>
                  )}
                </span>
              ))}
            </div>
          </FadeUp>

          {/* CTA */}
          <FadeUp delay={0.58}>
            <div style={{ marginTop: "60px" }}>
              <button
                onClick={onSignupClick}
                style={{
                  padding: "18px 40px", fontSize: "16px",
                  fontFamily: "'Pretendard', sans-serif", fontWeight: 700,
                  backgroundColor: "#EAB308", color: "#0F172A",
                  border: "none", cursor: "pointer", letterSpacing: "-0.01em",
                  transition: "opacity 0.18s, transform 0.18s",
                }}
                onMouseEnter={e => { (e.currentTarget as HTMLButtonElement).style.opacity = "0.88"; (e.currentTarget as HTMLButtonElement).style.transform = "translateY(-1px)"; }}
                onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.opacity = "1"; (e.currentTarget as HTMLButtonElement).style.transform = "translateY(0)"; }}
              >
                선익과 함께하기 — 무료 회원가입
              </button>
              <p style={{ fontSize: "12px", fontFamily: "'Pretendard', sans-serif", color: "#334155", marginTop: "14px" }}>
                이미 계정이 있으신가요?{" "}
                <button onClick={onLoginClick} style={{ background: "none", border: "none", cursor: "pointer", color: "#64748B", fontSize: "12px", fontFamily: "'Pretendard'", textDecoration: "underline", padding: 0 }}>
                  로그인
                </button>
              </p>
            </div>
          </FadeUp>
        </div>
      </section>

      <AboutOverlay open={aboutOpen} onClose={() => setAboutOpen(null)} />
    </>
  );
}

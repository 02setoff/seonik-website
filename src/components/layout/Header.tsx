"use client";

import { useState, useCallback, useRef, useEffect } from "react";
import { Menu, X } from "lucide-react";
import { useSession, signOut } from "next-auth/react";
import Link from "next/link";
import AuthModal from "@/components/auth/AuthModal";
import AboutOverlay, { AboutKey } from "@/components/intro/AboutOverlay";

const ABOUT_ITEMS: { key: AboutKey; label: string }[] = [
  { key: "mission", label: "미션" },
  { key: "vision", label: "비전" },
  { key: "company", label: "회사명" },
  { key: "slogan", label: "슬로건" },
  { key: "history", label: "연혁" },
];

interface FeedHeaderProps {
  onLogoClick?: () => void;
}

export default function FeedHeader({ onLogoClick }: FeedHeaderProps) {
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const [authTab, setAuthTab] = useState<"login" | "signup">("login");
  const [aboutKey, setAboutKey] = useState<AboutKey | null>(null);
  const [aboutDropdown, setAboutDropdown] = useState(false);
  const [userDropdown, setUserDropdown] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const aboutRef = useRef<HTMLDivElement>(null);
  const userRef = useRef<HTMLDivElement>(null);
  const { data: session } = useSession();

  const openLogin = useCallback(() => {
    setAuthTab("login");
    setIsAuthOpen(true);
    setMobileMenuOpen(false);
  }, []);

  const openSignup = useCallback(() => {
    setAuthTab("signup");
    setIsAuthOpen(true);
    setMobileMenuOpen(false);
  }, []);

  // 외부 클릭 시 드롭다운 닫기
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (aboutRef.current && !aboutRef.current.contains(e.target as Node)) setAboutDropdown(false);
      if (userRef.current && !userRef.current.contains(e.target as Node)) setUserDropdown(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  // 모바일 메뉴 열릴 때 body 스크롤 잠금
  useEffect(() => {
    document.body.style.overflow = mobileMenuOpen ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [mobileMenuOpen]);

  const dropdownBox: React.CSSProperties = {
    position: "absolute", top: "calc(100% + 6px)",
    backgroundColor: "var(--bg-card)",
    border: "1px solid var(--border)",
    boxShadow: "0 8px 32px rgba(0,0,0,0.12)",
    zIndex: 200, minWidth: "110px",
    padding: "5px 0",
  };

  const dropdownItem: React.CSSProperties = {
    display: "block", width: "100%",
    padding: "9px 16px",
    fontSize: "13px", fontFamily: "'Pretendard', sans-serif",
    color: "var(--text-secondary)",
    background: "none", border: "none", cursor: "pointer",
    textAlign: "left", textDecoration: "none",
    transition: "background 0.1s, color 0.1s",
    whiteSpace: "nowrap",
  };

  const navBtn: React.CSSProperties = {
    fontSize: "15px", fontFamily: "'Pretendard', sans-serif",
    fontWeight: 500, color: "var(--text-muted)",
    background: "none", border: "none", cursor: "pointer",
    padding: "5px 10px", textDecoration: "none",
    transition: "color 0.15s",
  };

  // 모바일 메뉴 섹션 라벨
  const mobileSectionLabel: React.CSSProperties = {
    fontSize: "10px", fontFamily: "Inter, sans-serif",
    fontWeight: 700, letterSpacing: "0.18em",
    color: "var(--text-disabled)",
    margin: "0 0 8px",
  };

  // 모바일 메뉴 항목
  const mobileMenuItem: React.CSSProperties = {
    display: "block", width: "100%",
    padding: "14px 0",
    fontSize: "17px", fontFamily: "'Pretendard', sans-serif",
    fontWeight: 500, color: "var(--text-primary)",
    background: "none", border: "none",
    borderBottom: "1px solid var(--border)",
    cursor: "pointer", textAlign: "left",
    textDecoration: "none",
    transition: "opacity 0.15s",
  };

  const Logo = (
    <div style={{ display: "inline-flex", flexDirection: "column", alignItems: "stretch", flexShrink: 0, gap: "3px" }}>
      <span style={{ fontSize: "24px", fontFamily: "'Pretendard', sans-serif", fontWeight: 800, color: "var(--text-primary)", lineHeight: 1, letterSpacing: "-0.02em" }}>선익</span>
      <span style={{ fontSize: "10px", fontFamily: "Inter, sans-serif", fontWeight: 700, color: "var(--text-placeholder)", lineHeight: 1, letterSpacing: "0.05em", textAlign: "justify", textAlignLast: "justify" } as React.CSSProperties}>SEONIK</span>
    </div>
  );

  return (
    <>
      <header
        className="sticky top-0 z-50"
        style={{
          height: "64px",
          backgroundColor: "var(--header-bg)",
          borderBottom: "1px solid var(--header-border)",
        }}
      >
        <div
          className="h-full flex items-center justify-between mx-auto px-4 md:px-10"
          style={{ maxWidth: "1280px" }}
        >
          {/* ── 좌측: 로고 ── */}
          {onLogoClick ? (
            <button onClick={onLogoClick} style={{ background: "none", border: "none", cursor: "pointer", padding: 0 }}>
              {Logo}
            </button>
          ) : (
            <Link href="/" style={{ textDecoration: "none" }}>{Logo}</Link>
          )}

          {/* ── 우측: 네비게이션 ── */}
          <div className="flex items-center gap-0.5">

            {/* About 드롭다운 — 데스크탑만 */}
            <div ref={aboutRef} style={{ position: "relative" }} className="hidden md:block">
              <button
                onClick={() => setAboutDropdown(v => !v)}
                style={navBtn}
                onMouseEnter={e => { (e.currentTarget as HTMLButtonElement).style.color = "var(--text-primary)"; }}
                onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.color = "var(--text-muted)"; }}
              >
                About
              </button>
              {aboutDropdown && (
                <div style={{ ...dropdownBox, left: 0 }}>
                  {ABOUT_ITEMS.map(item => (
                    <button
                      key={item.key}
                      style={dropdownItem}
                      onClick={() => { setAboutKey(item.key); setAboutDropdown(false); }}
                      onMouseEnter={e => { (e.currentTarget as HTMLButtonElement).style.backgroundColor = "var(--bg-hover)"; (e.currentTarget as HTMLButtonElement).style.color = "var(--text-primary)"; }}
                      onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.backgroundColor = "transparent"; (e.currentTarget as HTMLButtonElement).style.color = "var(--text-secondary)"; }}
                    >
                      {item.label}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Notice — 데스크탑만 */}
            <Link
              href="/notice"
              className="hidden md:inline"
              style={navBtn as React.CSSProperties}
              onMouseEnter={e => { (e.currentTarget as HTMLAnchorElement).style.color = "var(--text-primary)"; }}
              onMouseLeave={e => { (e.currentTarget as HTMLAnchorElement).style.color = "var(--text-muted)"; }}
            >
              Notice
            </Link>

            {/* ── 인증 영역 — 데스크탑 ── */}
            {session ? (
              <div ref={userRef} style={{ position: "relative" }} className="hidden md:block">
                <button
                  onClick={() => setUserDropdown(v => !v)}
                  style={{
                    padding: "5px 10px", fontSize: "15px",
                    fontFamily: "'Pretendard', sans-serif", fontWeight: 500,
                    color: "var(--text-primary)", background: "none",
                    border: "none", cursor: "pointer", borderRadius: "4px",
                    transition: "background 0.15s",
                  }}
                  onMouseEnter={e => { (e.currentTarget as HTMLButtonElement).style.backgroundColor = "var(--bg-hover)"; }}
                  onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.backgroundColor = "transparent"; }}
                >
                  {session.user?.name || session.user?.email?.split("@")[0]}
                </button>
                {userDropdown && (
                  <div style={{ ...dropdownBox, right: 0 }}>
                    <Link
                      href="/mypage"
                      style={dropdownItem}
                      onClick={() => setUserDropdown(false)}
                      onMouseEnter={e => { (e.currentTarget as HTMLAnchorElement).style.backgroundColor = "var(--bg-hover)"; (e.currentTarget as HTMLAnchorElement).style.color = "var(--text-primary)"; }}
                      onMouseLeave={e => { (e.currentTarget as HTMLAnchorElement).style.backgroundColor = "transparent"; (e.currentTarget as HTMLAnchorElement).style.color = "var(--text-secondary)"; }}
                    >
                      마이페이지
                    </Link>
                    <button
                      style={{ ...dropdownItem, color: "#94A3B8" }}
                      onClick={() => signOut({ callbackUrl: "/" })}
                      onMouseEnter={e => { (e.currentTarget as HTMLButtonElement).style.backgroundColor = "var(--bg-hover)"; (e.currentTarget as HTMLButtonElement).style.color = "var(--text-primary)"; }}
                      onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.backgroundColor = "transparent"; (e.currentTarget as HTMLButtonElement).style.color = "#94A3B8"; }}
                    >
                      로그아웃
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <div className="hidden md:flex items-center gap-1">
                <button
                  onClick={openLogin}
                  style={{ ...navBtn }}
                  onMouseEnter={e => { (e.currentTarget as HTMLButtonElement).style.color = "var(--text-primary)"; }}
                  onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.color = "var(--text-muted)"; }}
                >
                  로그인
                </button>
                <button
                  onClick={openSignup}
                  style={{
                    padding: "7px 16px", fontSize: "12px",
                    fontFamily: "'Pretendard', sans-serif", fontWeight: 600,
                    backgroundColor: "var(--text-primary)", color: "var(--bg-primary)",
                    border: "none", cursor: "pointer", transition: "opacity 0.15s",
                  }}
                  onMouseEnter={e => { (e.currentTarget as HTMLButtonElement).style.opacity = "0.85"; }}
                  onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.opacity = "1"; }}
                >
                  회원가입
                </button>
              </div>
            )}

            {/* ── 모바일: 햄버거 버튼 ── */}
            <button
              onClick={() => setMobileMenuOpen(v => !v)}
              className="flex md:hidden items-center justify-center"
              style={{
                background: "none", border: "none", cursor: "pointer",
                padding: "6px", marginLeft: "4px",
                color: "var(--text-primary)",
              }}
              aria-label={mobileMenuOpen ? "메뉴 닫기" : "메뉴 열기"}
            >
              {mobileMenuOpen
                ? <X size={22} strokeWidth={2} />
                : <Menu size={22} strokeWidth={2} />
              }
            </button>
          </div>
        </div>
      </header>

      {/* ── 모바일 풀스크린 메뉴 ── */}
      <div
        className="md:hidden"
        style={{
          position: "fixed",
          top: "64px", left: 0, right: 0, bottom: 0,
          backgroundColor: "var(--bg-primary)",
          zIndex: 49,
          overflowY: "auto",
          padding: "32px 28px 48px",
          opacity: mobileMenuOpen ? 1 : 0,
          pointerEvents: mobileMenuOpen ? "auto" : "none",
          transition: "opacity 0.2s ease",
        }}
      >
        {/* About */}
        <div style={{ marginBottom: "36px" }}>
          <p style={mobileSectionLabel}>ABOUT</p>
          {ABOUT_ITEMS.map(item => (
            <button
              key={item.key}
              style={mobileMenuItem}
              onClick={() => { setAboutKey(item.key); setMobileMenuOpen(false); }}
              onMouseEnter={e => { (e.currentTarget as HTMLButtonElement).style.opacity = "0.5"; }}
              onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.opacity = "1"; }}
            >
              {item.label}
            </button>
          ))}
        </div>

        {/* Navigate */}
        <div style={{ marginBottom: "36px" }}>
          <p style={mobileSectionLabel}>NAVIGATE</p>
          <Link
            href="/notice"
            style={mobileMenuItem}
            onClick={() => setMobileMenuOpen(false)}
            onMouseEnter={e => { (e.currentTarget as HTMLAnchorElement).style.opacity = "0.5"; }}
            onMouseLeave={e => { (e.currentTarget as HTMLAnchorElement).style.opacity = "1"; }}
          >
            Notice
          </Link>
          {session && (
            <Link
              href="/mypage"
              style={mobileMenuItem}
              onClick={() => setMobileMenuOpen(false)}
              onMouseEnter={e => { (e.currentTarget as HTMLAnchorElement).style.opacity = "0.5"; }}
              onMouseLeave={e => { (e.currentTarget as HTMLAnchorElement).style.opacity = "1"; }}
            >
              마이페이지
            </Link>
          )}
        </div>

        {/* Account */}
        <div>
          <p style={mobileSectionLabel}>ACCOUNT</p>
          {session ? (
            <button
              style={{ ...mobileMenuItem, color: "#94A3B8" }}
              onClick={() => { setMobileMenuOpen(false); signOut({ callbackUrl: "/" }); }}
              onMouseEnter={e => { (e.currentTarget as HTMLButtonElement).style.opacity = "0.5"; }}
              onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.opacity = "1"; }}
            >
              로그아웃
            </button>
          ) : (
            <>
              <button
                style={mobileMenuItem}
                onClick={openLogin}
                onMouseEnter={e => { (e.currentTarget as HTMLButtonElement).style.opacity = "0.5"; }}
                onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.opacity = "1"; }}
              >
                로그인
              </button>
              <button
                style={mobileMenuItem}
                onClick={openSignup}
                onMouseEnter={e => { (e.currentTarget as HTMLButtonElement).style.opacity = "0.5"; }}
                onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.opacity = "1"; }}
              >
                회원가입
              </button>
            </>
          )}
        </div>
      </div>

      <AboutOverlay open={aboutKey} onClose={() => setAboutKey(null)} />
      <AuthModal isOpen={isAuthOpen} onClose={() => setIsAuthOpen(false)} defaultTab={authTab} />
    </>
  );
}

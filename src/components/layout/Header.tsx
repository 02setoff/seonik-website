"use client";

import { useState, useCallback, useRef, useEffect } from "react";
import { ChevronDown, Search, User, LogOut } from "lucide-react";
import { useSession, signOut } from "next-auth/react";
import Link from "next/link";
import SearchModal from "./SearchModal";
import AuthModal from "@/components/auth/AuthModal";
import PostModal, { PostItem } from "@/components/feed/PostModal";

interface FeedHeaderProps {
  onLogoClick?: () => void;
}

const ABOUT_ITEMS = [
  { label: "미션", href: "/about/mission" },
  { label: "비전", href: "/about/vision" },
  { label: "회사명", href: "/about/company" },
  { label: "슬로건", href: "/about/slogan" },
  { label: "연혁", href: "/about/history" },
];


export default function FeedHeader({ onLogoClick }: FeedHeaderProps) {
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const [authTab, setAuthTab] = useState<"login" | "signup">("login");
  const [selectedPost, setSelectedPost] = useState<PostItem | null>(null);
  const [aboutOpen, setAboutOpen] = useState(false);
  const { data: session } = useSession();

  const aboutRef = useRef<HTMLDivElement>(null);

  // 드롭다운 외부 클릭/터치 닫기
  useEffect(() => {
    const handler = (e: Event) => {
      if (aboutRef.current && !aboutRef.current.contains(e.target as Node)) setAboutOpen(false);
    };
    document.addEventListener("mousedown", handler);
    document.addEventListener("touchstart", handler);
    return () => {
      document.removeEventListener("mousedown", handler);
      document.removeEventListener("touchstart", handler);
    };
  }, []);

  const openSearch = useCallback(() => setIsSearchOpen(true), []);
  const closeSearch = useCallback(() => setIsSearchOpen(false), []);
  const handleSelectPost = useCallback((post: PostItem) => setSelectedPost(post), []);
  const openLogin = useCallback(() => { setAuthTab("login"); setIsAuthOpen(true); }, []);
  const openSignup = useCallback(() => { setAuthTab("signup"); setIsAuthOpen(true); }, []);

  const dropdownStyle: React.CSSProperties = {
    position: "absolute", top: "calc(100% + 8px)", left: 0,
    backgroundColor: "var(--bg-card)",
    border: "1px solid var(--border)",
    zIndex: 200, boxShadow: "0 4px 20px rgba(0,0,0,0.12)",
  };

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
        <div className="h-full flex items-center justify-between mx-auto px-4 md:px-10" style={{ maxWidth: "1280px" }}>

          {/* ── 좌측: 로고 + About + Briefing ── */}
          <div className="flex items-center gap-1 md:gap-6">

            {/* 로고 */}
            {onLogoClick ? (
              <button onClick={onLogoClick}
                style={{ background: "none", border: "none", cursor: "pointer", padding: 0, display: "flex", flexDirection: "column", alignItems: "flex-start", flexShrink: 0 }}>
                <span style={{ fontSize: "17px", fontFamily: "'Pretendard', sans-serif", fontWeight: 700, color: "var(--text-primary)", lineHeight: 1 }}>선익</span>
                <span style={{ fontSize: "9px", fontFamily: "Inter, sans-serif", fontWeight: 600, color: "var(--text-primary)", letterSpacing: "0.15em", marginTop: "2px" }}>SEONIK</span>
              </button>
            ) : (
              <Link href="/" style={{ textDecoration: "none", display: "flex", flexDirection: "column", alignItems: "flex-start", flexShrink: 0 }}>
                <span style={{ fontSize: "17px", fontFamily: "'Pretendard', sans-serif", fontWeight: 700, color: "var(--text-primary)", lineHeight: 1 }}>선익</span>
                <span style={{ fontSize: "9px", fontFamily: "Inter, sans-serif", fontWeight: 600, color: "var(--text-primary)", letterSpacing: "0.15em", marginTop: "2px" }}>SEONIK</span>
              </Link>
            )}

            {/* About 드롭다운 */}
            <div ref={aboutRef} style={{ position: "relative" }}>
              <button
                onClick={() => { setAboutOpen(o => !o); }}
                style={{
                  display: "flex", alignItems: "center", gap: "2px",
                  padding: "5px 6px", background: "none", border: "none", cursor: "pointer",
                  color: aboutOpen ? "var(--text-primary)" : "var(--text-muted)",
                  fontFamily: "'Pretendard', sans-serif", fontWeight: 500,
                  borderRadius: "4px", transition: "all 0.15s", fontSize: "13px",
                }}>
                About
                <ChevronDown size={11} style={{ transition: "transform 0.15s", transform: aboutOpen ? "rotate(180deg)" : "none", flexShrink: 0 }} />
              </button>
              {aboutOpen && (
                <div style={{ ...dropdownStyle, minWidth: "130px" }}>
                  {ABOUT_ITEMS.map((item) => (
                    <Link key={item.href} href={item.href} onClick={() => setAboutOpen(false)}
                      style={{ display: "block", padding: "10px 18px", fontSize: "13px", fontFamily: "'Pretendard', sans-serif", color: "var(--text-secondary)", textDecoration: "none", transition: "all 0.1s" }}
                      onMouseEnter={e => { (e.currentTarget as HTMLAnchorElement).style.backgroundColor = "var(--bg-hover)"; (e.currentTarget as HTMLAnchorElement).style.color = "var(--text-primary)"; }}
                      onMouseLeave={e => { (e.currentTarget as HTMLAnchorElement).style.backgroundColor = "transparent"; (e.currentTarget as HTMLAnchorElement).style.color = "var(--text-secondary)"; }}>
                      {item.label}
                    </Link>
                  ))}
                </div>
              )}
            </div>


            {/* Notice 링크 */}
            <Link href="/notice"
              style={{
                padding: "5px 6px", color: "var(--text-muted)",
                fontFamily: "'Pretendard', sans-serif", fontWeight: 500,
                borderRadius: "4px", transition: "all 0.15s", fontSize: "13px",
                textDecoration: "none",
              }}
              onMouseEnter={e => { (e.currentTarget as HTMLAnchorElement).style.color = "var(--text-primary)"; (e.currentTarget as HTMLAnchorElement).style.backgroundColor = "var(--bg-hover)"; }}
              onMouseLeave={e => { (e.currentTarget as HTMLAnchorElement).style.color = "var(--text-muted)"; (e.currentTarget as HTMLAnchorElement).style.backgroundColor = "transparent"; }}>
              Notice
            </Link>
          </div>

          {/* ── 우측 ── */}
          <div className="flex items-center">

            {/* 검색 — 데스크탑: 텍스트 / 모바일: 아이콘 */}
            <button onClick={openSearch}
              style={{ background: "none", border: "none", cursor: "pointer", padding: "6px 8px", color: "var(--text-muted)", transition: "color 0.15s", display: "flex", alignItems: "center", gap: "4px" }}
              onMouseEnter={e => { (e.currentTarget as HTMLButtonElement).style.color = "var(--text-primary)"; }}
              onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.color = "var(--text-muted)"; }}
              aria-label="검색">
              <span className="hidden md:inline" style={{ fontSize: "14px", fontFamily: "'Pretendard', sans-serif", fontWeight: 500 }}>검색하기</span>
              <Search className="md:hidden" size={20} strokeWidth={2} />
            </button>

            {/* 인증 영역 */}
            {session ? (
              <>
                {/* 데스크탑 로그인 상태 */}
                <div className="hidden md:flex items-center gap-1">
                  <Link href="/mypage"
                    style={{ padding: "6px 10px", fontSize: "14px", fontFamily: "'Pretendard', sans-serif", fontWeight: 500, color: "var(--text-primary)", textDecoration: "none", borderRadius: "4px", transition: "background 0.15s" }}
                    onMouseEnter={e => { (e.currentTarget as HTMLAnchorElement).style.backgroundColor = "var(--bg-hover)"; }}
                    onMouseLeave={e => { (e.currentTarget as HTMLAnchorElement).style.backgroundColor = "transparent"; }}>
                    {session.user?.name || session.user?.email?.split("@")[0]}
                  </Link>
                  <button onClick={() => signOut({ callbackUrl: "/" })}
                    style={{ padding: "6px 10px", fontSize: "13px", fontFamily: "'Pretendard', sans-serif", background: "none", border: "none", cursor: "pointer", borderRadius: "4px", color: "var(--text-placeholder)", transition: "all 0.15s" }}
                    onMouseEnter={e => { (e.currentTarget as HTMLButtonElement).style.color = "var(--text-secondary)"; (e.currentTarget as HTMLButtonElement).style.backgroundColor = "var(--bg-hover)"; }}
                    onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.color = "var(--text-placeholder)"; (e.currentTarget as HTMLButtonElement).style.backgroundColor = "transparent"; }}>
                    로그아웃
                  </button>
                </div>
                {/* 모바일 로그인 상태 — 아이콘만 */}
                <div className="flex md:hidden items-center gap-0.5">
                  <Link href="/mypage"
                    style={{ padding: "6px 7px", display: "flex", alignItems: "center", color: "var(--text-primary)", transition: "color 0.15s" }}
                    aria-label="마이페이지">
                    <User size={20} strokeWidth={2} />
                  </Link>
                  <button onClick={() => signOut({ callbackUrl: "/" })}
                    style={{ background: "none", border: "none", cursor: "pointer", padding: "6px 7px", display: "flex", alignItems: "center", color: "var(--text-placeholder)", transition: "color 0.15s" }}
                    aria-label="로그아웃">
                    <LogOut size={20} strokeWidth={2} />
                  </button>
                </div>
              </>
            ) : (
              <>
                {/* 데스크탑 비로그인 */}
                <div className="hidden md:flex items-center gap-2">
                  <button onClick={openLogin}
                    style={{ padding: "6px 12px", fontSize: "14px", fontFamily: "'Pretendard', sans-serif", fontWeight: 500, color: "var(--text-muted)", background: "none", border: "none", cursor: "pointer", borderRadius: "4px", transition: "all 0.15s" }}
                    onMouseEnter={e => { (e.currentTarget as HTMLButtonElement).style.color = "var(--text-primary)"; (e.currentTarget as HTMLButtonElement).style.backgroundColor = "var(--bg-hover)"; }}
                    onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.color = "var(--text-muted)"; (e.currentTarget as HTMLButtonElement).style.backgroundColor = "transparent"; }}>
                    로그인
                  </button>
                  <button onClick={openSignup}
                    style={{ padding: "8px 18px", fontSize: "13px", fontFamily: "'Pretendard', sans-serif", fontWeight: 600, backgroundColor: "var(--text-primary)", color: "var(--bg-primary)", border: "none", cursor: "pointer", transition: "opacity 0.15s" }}
                    onMouseEnter={e => { (e.currentTarget as HTMLButtonElement).style.opacity = "0.85"; }}
                    onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.opacity = "1"; }}>
                    회원가입
                  </button>
                </div>
                {/* 모바일 비로그인 */}
                <div className="flex md:hidden items-center gap-1">
                  <button onClick={openLogin}
                    style={{ background: "none", border: "none", cursor: "pointer", padding: "4px 8px", fontSize: "12px", fontFamily: "'Pretendard', sans-serif", color: "var(--text-muted)" }}>
                    로그인
                  </button>
                  <button onClick={openSignup}
                    style={{ padding: "5px 10px", fontSize: "11px", fontFamily: "'Pretendard', sans-serif", fontWeight: 600, backgroundColor: "var(--text-primary)", color: "var(--bg-primary)", border: "none", cursor: "pointer" }}>
                    가입
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      </header>

      <SearchModal isOpen={isSearchOpen} onClose={closeSearch} onSelectPost={handleSelectPost} />
      <AuthModal isOpen={isAuthOpen} onClose={() => setIsAuthOpen(false)} defaultTab={authTab} />
      <PostModal post={selectedPost} onClose={() => setSelectedPost(null)} />
    </>
  );
}

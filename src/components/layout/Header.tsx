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

const BRIEFING_ITEMS = [
  { label: "RADAR", sub: "최신 트렌드 브리핑", href: "/radar" },
  { label: "CORE", sub: "비즈니스 모델 해부", href: "/core" },
  { label: "FLASH", sub: "긴급 인사이트", href: "/flash" },
];

export default function FeedHeader({ onLogoClick }: FeedHeaderProps) {
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const [authTab, setAuthTab] = useState<"login" | "signup">("login");
  const [selectedPost, setSelectedPost] = useState<PostItem | null>(null);
  const [aboutOpen, setAboutOpen] = useState(false);
  const [briefingOpen, setBriefingOpen] = useState(false);
  const { data: session } = useSession();

  const aboutRef = useRef<HTMLDivElement>(null);
  const briefingRef = useRef<HTMLDivElement>(null);

  // 드롭다운 외부 클릭/터치 닫기
  useEffect(() => {
    const handler = (e: Event) => {
      if (aboutRef.current && !aboutRef.current.contains(e.target as Node)) setAboutOpen(false);
      if (briefingRef.current && !briefingRef.current.contains(e.target as Node)) setBriefingOpen(false);
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
    backgroundColor: "white", border: "1px solid #E2E8F0",
    zIndex: 200, boxShadow: "0 4px 20px rgba(0,0,0,0.08)",
  };

  return (
    <>
      <header className="sticky top-0 z-50 bg-white border-b border-[#E2E8F0]" style={{ height: "64px" }}>
        <div className="h-full flex items-center justify-between mx-auto px-4 md:px-10" style={{ maxWidth: "1280px" }}>

          {/* ── 좌측: 로고 + About + Briefing (모바일 포함 전체 화면) ── */}
          <div className="flex items-center gap-1 md:gap-6">

            {/* 로고 */}
            {onLogoClick ? (
              <button onClick={onLogoClick}
                style={{ background: "none", border: "none", cursor: "pointer", padding: 0, display: "flex", flexDirection: "column", alignItems: "flex-start", flexShrink: 0 }}>
                <span style={{ fontSize: "17px", fontFamily: "'Pretendard', sans-serif", fontWeight: 700, color: "#0F172A", lineHeight: 1 }}>선익</span>
                <span style={{ fontSize: "9px", fontFamily: "Inter, sans-serif", fontWeight: 600, color: "#0F172A", letterSpacing: "0.15em", marginTop: "2px" }}>SEONIK</span>
              </button>
            ) : (
              <Link href="/" style={{ textDecoration: "none", display: "flex", flexDirection: "column", alignItems: "flex-start", flexShrink: 0 }}>
                <span style={{ fontSize: "17px", fontFamily: "'Pretendard', sans-serif", fontWeight: 700, color: "#0F172A", lineHeight: 1 }}>선익</span>
                <span style={{ fontSize: "9px", fontFamily: "Inter, sans-serif", fontWeight: 600, color: "#0F172A", letterSpacing: "0.15em", marginTop: "2px" }}>SEONIK</span>
              </Link>
            )}

            {/* About 드롭다운 */}
            <div ref={aboutRef} style={{ position: "relative" }}>
              <button
                onClick={() => { setAboutOpen(o => !o); setBriefingOpen(false); }}
                className="hover:text-[#0F172A] hover:bg-[#F8F9FA]"
                style={{
                  display: "flex", alignItems: "center", gap: "2px",
                  padding: "5px 6px", background: "none", border: "none", cursor: "pointer",
                  color: aboutOpen ? "#0F172A" : "#64748B",
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
                      className="hover:bg-[#F8F9FA] hover:text-[#0F172A]"
                      style={{ display: "block", padding: "10px 18px", fontSize: "13px", fontFamily: "'Pretendard', sans-serif", color: "#475569", textDecoration: "none" }}>
                      {item.label}
                    </Link>
                  ))}
                </div>
              )}
            </div>

            {/* Briefing 드롭다운 */}
            <div ref={briefingRef} style={{ position: "relative" }}>
              <button
                onClick={() => { setBriefingOpen(o => !o); setAboutOpen(false); }}
                className="hover:text-[#0F172A] hover:bg-[#F8F9FA]"
                style={{
                  display: "flex", alignItems: "center", gap: "2px",
                  padding: "5px 6px", background: "none", border: "none", cursor: "pointer",
                  color: briefingOpen ? "#0F172A" : "#64748B",
                  fontFamily: "'Pretendard', sans-serif", fontWeight: 500,
                  borderRadius: "4px", transition: "all 0.15s", fontSize: "13px",
                }}>
                Briefing
                <ChevronDown size={11} style={{ transition: "transform 0.15s", transform: briefingOpen ? "rotate(180deg)" : "none", flexShrink: 0 }} />
              </button>
              {briefingOpen && (
                <div style={{ ...dropdownStyle, minWidth: "200px" }}>
                  {BRIEFING_ITEMS.map((item) => (
                    <Link key={item.href} href={item.href} onClick={() => setBriefingOpen(false)}
                      className="hover:bg-[#F8F9FA]"
                      style={{ display: "flex", alignItems: "center", gap: "8px", padding: "10px 18px", textDecoration: "none" }}>
                      <span style={{ fontSize: "11px", fontFamily: "Inter, sans-serif", fontWeight: 700, color: "#0F172A", letterSpacing: "0.06em", minWidth: "40px" }}>{item.label}</span>
                      <span style={{ fontSize: "11px", fontFamily: "'Pretendard', sans-serif", color: "#94A3B8" }}>{item.sub}</span>
                    </Link>
                  ))}
                </div>
              )}
            </div>

            {/* Notice 링크 */}
            <Link href="/notice"
              className="hover:text-[#0F172A] hover:bg-[#F8F9FA]"
              style={{
                padding: "5px 6px", color: "#64748B",
                fontFamily: "'Pretendard', sans-serif", fontWeight: 500,
                borderRadius: "4px", transition: "all 0.15s", fontSize: "13px",
                textDecoration: "none",
              }}>
              Notice
            </Link>
          </div>

          {/* ── 우측 ── */}
          <div className="flex items-center">

            {/* 검색 — 데스크탑: 텍스트 / 모바일: 아이콘 */}
            <button onClick={openSearch}
              className="flex items-center gap-1 text-[#64748B] hover:text-[#0F172A] transition-colors"
              style={{ background: "none", border: "none", cursor: "pointer", padding: "6px 8px" }}
              aria-label="검색">
              {/* 데스크탑 */}
              <span className="hidden md:inline" style={{ fontSize: "14px", fontFamily: "'Pretendard', sans-serif", fontWeight: 500 }}>검색하기</span>
              {/* 모바일 */}
              <Search className="md:hidden" size={20} strokeWidth={2} />
            </button>

            {/* 인증 영역 — 데스크탑: 풀 버튼 / 모바일: 컴팩트 텍스트 */}
            {session ? (
              <>
                {/* 데스크탑 로그인 상태 */}
                <div className="hidden md:flex items-center gap-1">
                  <Link href="/mypage"
                    className="hover:bg-[#F8F9FA] transition-colors"
                    style={{ padding: "6px 10px", fontSize: "14px", fontFamily: "'Pretendard', sans-serif", fontWeight: 500, color: "#0F172A", textDecoration: "none", borderRadius: "4px" }}>
                    {session.user?.name || session.user?.email?.split("@")[0]}
                  </Link>
                  <button onClick={() => signOut({ callbackUrl: "/" })}
                    className="text-[#94A3B8] hover:text-[#475569] transition-colors hover:bg-[#F8F9FA]"
                    style={{ padding: "6px 10px", fontSize: "13px", fontFamily: "'Pretendard', sans-serif", background: "none", border: "none", cursor: "pointer", borderRadius: "4px" }}>
                    로그아웃
                  </button>
                </div>
                {/* 모바일 로그인 상태 — 아이콘만 표시 */}
                <div className="flex md:hidden items-center gap-0.5">
                  <Link href="/mypage"
                    className="text-[#0F172A] hover:text-[#334155] transition-colors"
                    style={{ padding: "6px 7px", display: "flex", alignItems: "center" }}
                    aria-label="마이페이지">
                    <User size={20} strokeWidth={2} />
                  </Link>
                  <button onClick={() => signOut({ callbackUrl: "/" })}
                    className="text-[#94A3B8] hover:text-[#475569] transition-colors"
                    style={{ background: "none", border: "none", cursor: "pointer", padding: "6px 7px", display: "flex", alignItems: "center" }}
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
                    className="hover:text-[#0F172A] hover:bg-[#F8F9FA] transition-colors"
                    style={{ padding: "6px 12px", fontSize: "14px", fontFamily: "'Pretendard', sans-serif", fontWeight: 500, color: "#64748B", background: "none", border: "none", cursor: "pointer", borderRadius: "4px" }}>
                    로그인
                  </button>
                  <button onClick={openSignup}
                    className="hover:opacity-85 transition-opacity"
                    style={{ padding: "8px 18px", fontSize: "13px", fontFamily: "'Pretendard', sans-serif", fontWeight: 600, backgroundColor: "#0F172A", color: "white", border: "none", cursor: "pointer" }}>
                    회원가입
                  </button>
                </div>
                {/* 모바일 비로그인 */}
                <div className="flex md:hidden items-center gap-1">
                  <button onClick={openLogin}
                    style={{ background: "none", border: "none", cursor: "pointer", padding: "4px 8px", fontSize: "12px", fontFamily: "'Pretendard', sans-serif", color: "#64748B" }}>
                    로그인
                  </button>
                  <button onClick={openSignup}
                    style={{ padding: "5px 10px", fontSize: "11px", fontFamily: "'Pretendard', sans-serif", fontWeight: 600, backgroundColor: "#0F172A", color: "white", border: "none", cursor: "pointer" }}>
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

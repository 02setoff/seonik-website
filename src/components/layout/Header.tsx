"use client";

import { useState, useCallback, useRef, useEffect } from "react";
import { Search, LogOut, User, ChevronDown, Menu, X } from "lucide-react";
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
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [mobileAboutOpen, setMobileAboutOpen] = useState(false);
  const [mobileBriefingOpen, setMobileBriefingOpen] = useState(false);
  const { data: session } = useSession();

  const aboutRef = useRef<HTMLDivElement>(null);
  const briefingRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (aboutRef.current && !aboutRef.current.contains(e.target as Node)) setAboutOpen(false);
      if (briefingRef.current && !briefingRef.current.contains(e.target as Node)) setBriefingOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  useEffect(() => {
    document.body.style.overflow = mobileMenuOpen ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [mobileMenuOpen]);

  const openSearch = useCallback(() => { setIsSearchOpen(true); setMobileMenuOpen(false); }, []);
  const closeSearch = useCallback(() => setIsSearchOpen(false), []);
  const handleSelectPost = useCallback((post: PostItem) => setSelectedPost(post), []);

  const openLogin = useCallback(() => { setAuthTab("login"); setIsAuthOpen(true); setMobileMenuOpen(false); }, []);
  const openSignup = useCallback(() => { setAuthTab("signup"); setIsAuthOpen(true); setMobileMenuOpen(false); }, []);

  const dropdownStyle: React.CSSProperties = {
    position: "absolute", top: "calc(100% + 6px)", left: "50%", transform: "translateX(-50%)",
    backgroundColor: "white", border: "1px solid #E2E8F0",
    minWidth: "160px", zIndex: 200, boxShadow: "0 4px 20px rgba(0,0,0,0.08)",
  };

  return (
    <>
      <header className="sticky top-0 z-50 bg-white border-b border-[#E2E8F0]" style={{ height: "64px" }}>
        <div className="h-full flex items-center justify-between" style={{ maxWidth: "1280px", margin: "0 auto", padding: "0 40px" }}>

          {/* 좌측: 로고 + 네비 */}
          <div className="flex items-center" style={{ gap: "28px" }}>
            {onLogoClick ? (
              <button onClick={onLogoClick} className="flex flex-col items-start hover:opacity-70 transition-opacity" style={{ background: "none", border: "none", cursor: "pointer", padding: 0 }}>
                <span style={{ fontSize: "19px", fontFamily: "'Pretendard', sans-serif", fontWeight: 700, color: "#0F172A", lineHeight: 1 }}>선익</span>
                <span style={{ fontSize: "10px", fontFamily: "Inter, sans-serif", fontWeight: 600, color: "#0F172A", letterSpacing: "0.15em", marginTop: "2px" }}>SEONIK</span>
              </button>
            ) : (
              <Link href="/" className="flex flex-col items-start hover:opacity-70 transition-opacity" style={{ textDecoration: "none" }}>
                <span style={{ fontSize: "19px", fontFamily: "'Pretendard', sans-serif", fontWeight: 700, color: "#0F172A", lineHeight: 1 }}>선익</span>
                <span style={{ fontSize: "10px", fontFamily: "Inter, sans-serif", fontWeight: 600, color: "#0F172A", letterSpacing: "0.15em", marginTop: "2px" }}>SEONIK</span>
              </Link>
            )}

            {/* 데스크탑 메뉴 */}
            <nav className="hidden md:flex items-center" style={{ gap: "4px" }}>
              {/* About */}
              <div ref={aboutRef} style={{ position: "relative" }}>
                <button onClick={() => { setAboutOpen(o => !o); setBriefingOpen(false); }}
                  style={{ display: "flex", alignItems: "center", gap: "3px", padding: "6px 10px", background: "none", border: "none", cursor: "pointer", fontSize: "14px", fontFamily: "'Pretendard', sans-serif", fontWeight: 500, color: aboutOpen ? "#0F172A" : "#64748B", borderRadius: "4px", transition: "all 0.15s" }}
                  className="hover:text-[#0F172A] hover:bg-[#F8F9FA]">
                  About
                  <ChevronDown size={13} style={{ transition: "transform 0.15s", transform: aboutOpen ? "rotate(180deg)" : "none" }} />
                </button>
                {aboutOpen && (
                  <div style={dropdownStyle}>
                    {ABOUT_ITEMS.map((item) => (
                      <Link key={item.href} href={item.href} onClick={() => setAboutOpen(false)}
                        style={{ display: "block", padding: "10px 20px", fontSize: "14px", fontFamily: "'Pretendard', sans-serif", color: "#475569", textDecoration: "none", transition: "all 0.1s" }}
                        className="hover:bg-[#F8F9FA] hover:text-[#0F172A]">
                        {item.label}
                      </Link>
                    ))}
                  </div>
                )}
              </div>

              {/* 브리핑 */}
              <div ref={briefingRef} style={{ position: "relative" }}>
                <button onClick={() => { setBriefingOpen(o => !o); setAboutOpen(false); }}
                  style={{ display: "flex", alignItems: "center", gap: "3px", padding: "6px 10px", background: "none", border: "none", cursor: "pointer", fontSize: "14px", fontFamily: "'Pretendard', sans-serif", fontWeight: 500, color: briefingOpen ? "#0F172A" : "#64748B", borderRadius: "4px", transition: "all 0.15s" }}
                  className="hover:text-[#0F172A] hover:bg-[#F8F9FA]">
                  브리핑
                  <ChevronDown size={13} style={{ transition: "transform 0.15s", transform: briefingOpen ? "rotate(180deg)" : "none" }} />
                </button>
                {briefingOpen && (
                  <div style={{ ...dropdownStyle, minWidth: "220px" }}>
                    {BRIEFING_ITEMS.map((item) => (
                      <Link key={item.href} href={item.href} onClick={() => setBriefingOpen(false)}
                        style={{ display: "flex", alignItems: "center", gap: "8px", padding: "11px 20px", textDecoration: "none", transition: "background 0.1s" }}
                        className="hover:bg-[#F8F9FA]">
                        <span style={{ fontSize: "12px", fontFamily: "Inter, sans-serif", fontWeight: 700, color: "#0F172A", letterSpacing: "0.06em", minWidth: "48px" }}>{item.label}</span>
                        <span style={{ fontSize: "12px", fontFamily: "'Pretendard', sans-serif", color: "#94A3B8" }}>{item.sub}</span>
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            </nav>
          </div>

          {/* 우측 */}
          <div className="flex items-center" style={{ gap: "8px" }}>
            <button onClick={openSearch} className="flex items-center gap-1 text-[#64748B] hover:text-[#0F172A] transition-colors" style={{ background: "none", border: "none", cursor: "pointer", padding: "6px 8px" }}>
              <span className="hidden md:inline" style={{ fontSize: "14px", fontFamily: "'Pretendard', sans-serif", fontWeight: 500 }}>검색하기</span>
              <Search size={20} className="md:hidden" />
            </button>

            {/* 데스크탑 인증 */}
            {session ? (
              <div className="hidden md:flex items-center" style={{ gap: "4px" }}>
                <Link href="/mypage" style={{ padding: "6px 10px", fontSize: "14px", fontFamily: "'Pretendard', sans-serif", fontWeight: 500, color: "#0F172A", textDecoration: "none", borderRadius: "4px" }}
                  className="hover:bg-[#F8F9FA] transition-colors">
                  {session.user?.name || session.user?.email?.split("@")[0]}
                </Link>
                <button onClick={() => signOut({ callbackUrl: "/" })}
                  className="flex items-center gap-1 text-[#94A3B8] hover:text-[#475569] transition-colors hover:bg-[#F8F9FA]"
                  style={{ padding: "6px 10px", fontSize: "13px", fontFamily: "'Pretendard', sans-serif", background: "none", border: "none", cursor: "pointer", borderRadius: "4px" }}>
                  <LogOut size={14} /><span>로그아웃</span>
                </button>
              </div>
            ) : (
              <div className="hidden md:flex items-center" style={{ gap: "8px" }}>
                <button onClick={openLogin} style={{ padding: "6px 12px", fontSize: "14px", fontFamily: "'Pretendard', sans-serif", fontWeight: 500, color: "#64748B", background: "none", border: "none", cursor: "pointer", borderRadius: "4px" }}
                  className="hover:text-[#0F172A] hover:bg-[#F8F9FA] transition-colors">로그인</button>
                <button onClick={openSignup} style={{ padding: "8px 18px", fontSize: "13px", fontFamily: "'Pretendard', sans-serif", fontWeight: 600, backgroundColor: "#0F172A", color: "white", border: "none", cursor: "pointer" }}
                  className="hover:opacity-85 transition-opacity">회원가입</button>
              </div>
            )}

            {/* 모바일 햄버거 */}
            <button onClick={() => setMobileMenuOpen(o => !o)} className="md:hidden text-[#64748B] hover:text-[#0F172A] transition-colors" style={{ background: "none", border: "none", cursor: "pointer", padding: "4px" }}>
              {mobileMenuOpen ? <X size={22} /> : <Menu size={22} />}
            </button>
          </div>
        </div>
      </header>

      {/* 모바일 메뉴 오버레이 */}
      {mobileMenuOpen && (
        <div style={{ position: "fixed", top: "64px", left: 0, right: 0, bottom: 0, backgroundColor: "white", zIndex: 49, overflowY: "auto", borderTop: "1px solid #E2E8F0" }}>
          {session && (
            <div style={{ padding: "16px 24px", borderBottom: "1px solid #F1F5F9", backgroundColor: "#F8F9FA" }}>
              <p style={{ fontSize: "14px", fontFamily: "'Pretendard', sans-serif", fontWeight: 600, color: "#0F172A" }}>
                {session.user?.name || session.user?.email?.split("@")[0]}
              </p>
              <p style={{ fontSize: "12px", fontFamily: "'Pretendard', sans-serif", color: "#94A3B8", marginTop: "2px" }}>{session.user?.email}</p>
            </div>
          )}

          {/* About */}
          <div style={{ borderBottom: "1px solid #F1F5F9" }}>
            <button onClick={() => setMobileAboutOpen(o => !o)}
              style={{ width: "100%", display: "flex", alignItems: "center", justifyContent: "space-between", padding: "16px 24px", background: "none", border: "none", cursor: "pointer" }}>
              <span style={{ fontSize: "15px", fontFamily: "'Pretendard', sans-serif", fontWeight: 600, color: "#0F172A" }}>About</span>
              <ChevronDown size={16} color="#94A3B8" style={{ transform: mobileAboutOpen ? "rotate(180deg)" : "none", transition: "transform 0.15s" }} />
            </button>
            {mobileAboutOpen && (
              <div style={{ paddingBottom: "8px" }}>
                {ABOUT_ITEMS.map((item) => (
                  <Link key={item.href} href={item.href} onClick={() => setMobileMenuOpen(false)}
                    style={{ display: "block", padding: "11px 24px 11px 40px", fontSize: "14px", fontFamily: "'Pretendard', sans-serif", color: "#64748B", textDecoration: "none" }}>
                    {item.label}
                  </Link>
                ))}
              </div>
            )}
          </div>

          {/* 브리핑 */}
          <div style={{ borderBottom: "1px solid #F1F5F9" }}>
            <button onClick={() => setMobileBriefingOpen(o => !o)}
              style={{ width: "100%", display: "flex", alignItems: "center", justifyContent: "space-between", padding: "16px 24px", background: "none", border: "none", cursor: "pointer" }}>
              <span style={{ fontSize: "15px", fontFamily: "'Pretendard', sans-serif", fontWeight: 600, color: "#0F172A" }}>브리핑</span>
              <ChevronDown size={16} color="#94A3B8" style={{ transform: mobileBriefingOpen ? "rotate(180deg)" : "none", transition: "transform 0.15s" }} />
            </button>
            {mobileBriefingOpen && (
              <div style={{ paddingBottom: "8px" }}>
                {BRIEFING_ITEMS.map((item) => (
                  <Link key={item.href} href={item.href} onClick={() => setMobileMenuOpen(false)}
                    style={{ display: "block", padding: "11px 24px 11px 40px", textDecoration: "none" }}>
                    <span style={{ fontSize: "13px", fontFamily: "Inter, sans-serif", fontWeight: 700, color: "#0F172A" }}>{item.label}</span>
                    <span style={{ fontSize: "11px", fontFamily: "'Pretendard', sans-serif", color: "#94A3B8", marginLeft: "8px" }}>{item.sub}</span>
                  </Link>
                ))}
              </div>
            )}
          </div>

          {/* 검색 */}
          <button onClick={openSearch} style={{ width: "100%", display: "flex", alignItems: "center", gap: "12px", padding: "16px 24px", background: "none", border: "none", cursor: "pointer", borderBottom: "1px solid #F1F5F9" }}>
            <Search size={16} color="#64748B" />
            <span style={{ fontSize: "15px", fontFamily: "'Pretendard', sans-serif", color: "#64748B" }}>검색하기</span>
          </button>

          {session ? (
            <>
              <Link href="/mypage" onClick={() => setMobileMenuOpen(false)}
                style={{ display: "flex", alignItems: "center", gap: "12px", padding: "16px 24px", textDecoration: "none", borderBottom: "1px solid #F1F5F9" }}>
                <User size={16} color="#64748B" />
                <span style={{ fontSize: "15px", fontFamily: "'Pretendard', sans-serif", color: "#64748B" }}>마이페이지</span>
              </Link>
              <button onClick={() => { signOut({ callbackUrl: "/" }); setMobileMenuOpen(false); }}
                style={{ width: "100%", display: "flex", alignItems: "center", gap: "12px", padding: "16px 24px", background: "none", border: "none", cursor: "pointer" }}>
                <LogOut size={16} color="#EF4444" />
                <span style={{ fontSize: "15px", fontFamily: "'Pretendard', sans-serif", color: "#EF4444" }}>로그아웃</span>
              </button>
            </>
          ) : (
            <div style={{ padding: "16px 24px", display: "flex", flexDirection: "column", gap: "10px" }}>
              <button onClick={openLogin} style={{ padding: "13px", border: "1px solid #E2E8F0", background: "white", cursor: "pointer", fontSize: "14px", fontFamily: "'Pretendard', sans-serif", fontWeight: 600, color: "#0F172A" }}>
                로그인
              </button>
              <button onClick={openSignup} style={{ padding: "13px", border: "none", backgroundColor: "#0F172A", cursor: "pointer", fontSize: "14px", fontFamily: "'Pretendard', sans-serif", fontWeight: 600, color: "white" }}>
                회원가입
              </button>
            </div>
          )}
        </div>
      )}

      <SearchModal isOpen={isSearchOpen} onClose={closeSearch} onSelectPost={handleSelectPost} />
      <AuthModal isOpen={isAuthOpen} onClose={() => setIsAuthOpen(false)} defaultTab={authTab} />
      <PostModal post={selectedPost} onClose={() => setSelectedPost(null)} />
    </>
  );
}

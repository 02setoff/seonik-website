"use client";

import { useState, useCallback } from "react";
import { Search, LogOut } from "lucide-react";
import { useSession, signOut } from "next-auth/react";
import Link from "next/link";
import SearchModal from "./SearchModal";
import AuthModal from "@/components/auth/AuthModal";

interface FeedHeaderProps {
  onLogoClick?: () => void;
}

export default function FeedHeader({ onLogoClick }: FeedHeaderProps) {
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const [authTab, setAuthTab] = useState<"login" | "signup">("login");
  const { data: session } = useSession();

  const openSearch = useCallback(() => setIsSearchOpen(true), []);
  const closeSearch = useCallback(() => setIsSearchOpen(false), []);

  const openLogin = useCallback(() => {
    setAuthTab("login");
    setIsAuthOpen(true);
  }, []);

  const openSignup = useCallback(() => {
    setAuthTab("signup");
    setIsAuthOpen(true);
  }, []);

  const closeAuth = useCallback(() => setIsAuthOpen(false), []);

  return (
    <>
      <header
        className="sticky top-0 z-50 bg-white border-b border-[#E2E8F0]"
        style={{ height: "72px" }}
      >
        <div
          className="mx-auto h-full flex items-center justify-between px-10 max-md:px-5"
          style={{ maxWidth: "1280px" }}
        >
          {/* 좌측: 로고 */}
          {onLogoClick ? (
            <button
              onClick={onLogoClick}
              className="flex flex-col items-start cursor-pointer hover:opacity-75 transition-opacity duration-200"
            >
              <span
                className="font-bold text-[#0F172A] leading-none"
                style={{ fontSize: "20px", fontFamily: "'Pretendard', sans-serif" }}
              >
                선익
              </span>
              <span
                className="font-semibold text-[#0F172A] leading-none"
                style={{ fontSize: "11px", marginTop: "3px", fontFamily: "Inter, sans-serif", letterSpacing: "0.15em" }}
              >
                SEONIK
              </span>
            </button>
          ) : (
            <Link
              href="/"
              className="flex flex-col items-start hover:opacity-75 transition-opacity duration-200"
            >
              <span
                className="font-bold text-[#0F172A] leading-none"
                style={{ fontSize: "20px", fontFamily: "'Pretendard', sans-serif" }}
              >
                선익
              </span>
              <span
                className="font-semibold text-[#0F172A] leading-none"
                style={{ fontSize: "11px", marginTop: "3px", fontFamily: "Inter, sans-serif", letterSpacing: "0.15em" }}
              >
                SEONIK
              </span>
            </Link>
          )}

          {/* 우측: 네비게이션 */}
          <nav className="flex items-center" style={{ gap: "24px" }}>
            {/* 검색 — 항상 표시 */}
            <button
              onClick={openSearch}
              className="font-medium text-[#475569] hover:text-[#0F172A] transition-colors duration-200"
              style={{
                fontSize: "14px",
                fontFamily: "'Pretendard', sans-serif",
              }}
            >
              <span className="hidden md:inline">검색하기</span>
              <Search size={20} className="md:hidden" />
            </button>

            {/* 인증 상태에 따른 버튼 */}
            {session ? (
              /* 로그인 상태 */
              <div className="flex items-center" style={{ gap: "12px" }}>
                <Link
                  href="/mypage"
                  className="hidden md:block text-[#0F172A] font-medium hover:text-[#475569] transition-colors duration-200"
                  style={{ fontSize: "14px", fontFamily: "'Pretendard', sans-serif" }}
                >
                  {session.user?.name || session.user?.email?.split("@")[0]}
                </Link>
                <button
                  onClick={() => signOut({ callbackUrl: "/" })}
                  className="flex items-center gap-1 text-[#94A3B8] hover:text-[#0F172A] transition-colors duration-200"
                  style={{ fontSize: "13px", fontFamily: "'Pretendard', sans-serif" }}
                  title="로그아웃"
                >
                  <LogOut size={16} />
                  <span className="hidden md:inline">로그아웃</span>
                </button>
              </div>
            ) : (
              /* 비로그인 상태 */
              <div className="flex items-center" style={{ gap: "12px" }}>
                <button
                  onClick={openLogin}
                  className="hidden md:block font-medium text-[#475569] hover:text-[#0F172A] transition-colors duration-200"
                  style={{ fontSize: "14px", fontFamily: "'Pretendard', sans-serif" }}
                >
                  로그인
                </button>
                <button
                  onClick={openSignup}
                  className="font-medium text-white hover:opacity-90 transition-opacity duration-200"
                  style={{
                    fontSize: "13px",
                    fontFamily: "'Pretendard', sans-serif",
                    backgroundColor: "#0F172A",
                    padding: "7px 16px",
                  }}
                >
                  회원가입
                </button>
              </div>
            )}
          </nav>
        </div>
      </header>

      <SearchModal isOpen={isSearchOpen} onClose={closeSearch} />
      <AuthModal isOpen={isAuthOpen} onClose={closeAuth} defaultTab={authTab} />
    </>
  );
}

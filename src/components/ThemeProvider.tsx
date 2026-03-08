"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { useSession } from "next-auth/react";

type Theme = "light" | "dark";

interface ThemeContextType {
  theme: Theme;
  toggleTheme: () => void;
}

const ThemeContext = createContext<ThemeContextType>({
  theme: "light",
  toggleTheme: () => {},
});

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setTheme] = useState<Theme>("light");
  const { data: session } = useSession();

  // 테마 적용 헬퍼
  const applyTheme = (t: Theme) => {
    setTheme(t);
    document.documentElement.setAttribute("data-theme", t);
    localStorage.setItem("seonik-theme", t);
  };

  // 초기화: 로그인 회원 → DB / 비로그인 → localStorage / 최초 방문 → 시스템 설정
  useEffect(() => {
    if (session?.user?.email) {
      fetch("/api/user/theme")
        .then((r) => r.json())
        .then((d) => applyTheme((d.theme as Theme) ?? "light"))
        .catch(() => {
          const saved = localStorage.getItem("seonik-theme") as Theme | null;
          applyTheme(saved ?? "light");
        });
    } else if (session !== undefined) {
      // session이 null(로그아웃)이거나 undefined가 아닌 경우
      const saved = localStorage.getItem("seonik-theme") as Theme | null;
      if (saved) {
        applyTheme(saved);
      } else {
        const systemDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
        applyTheme(systemDark ? "dark" : "light");
      }
    }
  }, [session?.user?.email]);

  const toggleTheme = () => {
    const next: Theme = theme === "light" ? "dark" : "light";
    applyTheme(next);
    // 로그인 상태면 DB에도 저장 (크로스 디바이스 동기화)
    if (session?.user?.email) {
      fetch("/api/user/theme", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ theme: next }),
      }).catch(() => {});
    }
  };

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

export const useTheme = () => useContext(ThemeContext);

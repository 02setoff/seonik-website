"use client";

import { useState, useEffect, useCallback } from "react";
import { signIn } from "next-auth/react";
import { X } from "lucide-react";

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  defaultTab?: "login" | "signup";
}

export default function AuthModal({
  isOpen,
  onClose,
  defaultTab = "login",
}: AuthModalProps) {
  const [tab, setTab] = useState<"login" | "signup">(defaultTab);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // 로그인 폼
  const [loginEmail, setLoginEmail] = useState("");
  const [loginPassword, setLoginPassword] = useState("");

  // 회원가입 폼
  const [signupName, setSignupName] = useState("");
  const [signupEmail, setSignupEmail] = useState("");
  const [signupPassword, setSignupPassword] = useState("");
  const [signupConfirm, setSignupConfirm] = useState("");

  useEffect(() => {
    setTab(defaultTab);
    setError("");
  }, [defaultTab, isOpen]);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  const handleEsc = useCallback(
    (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    },
    [onClose]
  );

  useEffect(() => {
    window.addEventListener("keydown", handleEsc);
    return () => window.removeEventListener("keydown", handleEsc);
  }, [handleEsc]);

  const handleGoogleLogin = async () => {
    setLoading(true);
    await signIn("google", { callbackUrl: "/" });
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    const result = await signIn("credentials", {
      email: loginEmail,
      password: loginPassword,
      redirect: false,
    });

    setLoading(false);
    if (result?.error) {
      setError("이메일 또는 비밀번호가 올바르지 않습니다.");
    } else {
      onClose();
      window.location.reload();
    }
  };

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (signupPassword !== signupConfirm) {
      setError("비밀번호가 일치하지 않습니다.");
      return;
    }
    if (signupPassword.length < 6) {
      setError("비밀번호는 6자 이상이어야 합니다.");
      return;
    }

    setLoading(true);
    const res = await fetch("/api/auth/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: signupName,
        email: signupEmail,
        password: signupPassword,
      }),
    });
    const data = await res.json();
    setLoading(false);

    if (!res.ok) {
      setError(data.error || "회원가입에 실패했습니다.");
      return;
    }

    // 가입 후 자동 로그인
    const result = await signIn("credentials", {
      email: signupEmail,
      password: signupPassword,
      redirect: false,
    });

    if (result?.ok) {
      onClose();
      window.location.reload();
    } else {
      setTab("login");
      setError("가입이 완료되었습니다. 로그인해 주세요.");
    }
  };

  if (!isOpen) return null;

  const inputStyle: React.CSSProperties = {
    width: "100%",
    padding: "10px 14px",
    border: "1px solid #E2E8F0",
    outline: "none",
    fontSize: "14px",
    fontFamily: "'Pretendard', sans-serif",
    color: "#0F172A",
    backgroundColor: "#F8FAFC",
    borderRadius: 0,
    boxSizing: "border-box",
  };

  const btnPrimaryStyle: React.CSSProperties = {
    width: "100%",
    padding: "12px",
    backgroundColor: "#0F172A",
    color: "white",
    border: "none",
    cursor: loading ? "not-allowed" : "pointer",
    fontSize: "14px",
    fontFamily: "'Pretendard', sans-serif",
    fontWeight: 600,
    opacity: loading ? 0.6 : 1,
    borderRadius: 0,
  };

  const btnGoogleStyle: React.CSSProperties = {
    width: "100%",
    padding: "11px",
    backgroundColor: "white",
    color: "#0F172A",
    border: "1px solid #E2E8F0",
    cursor: loading ? "not-allowed" : "pointer",
    fontSize: "14px",
    fontFamily: "'Pretendard', sans-serif",
    fontWeight: 500,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    gap: "10px",
    borderRadius: 0,
  };

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 300,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "20px",
        backgroundColor: "rgba(15, 23, 42, 0.6)",
        backdropFilter: "blur(4px)",
      }}
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div
        style={{
          backgroundColor: "white",
          width: "100%",
          maxWidth: "420px",
          padding: "40px 36px",
          position: "relative",
        }}
      >
        {/* 닫기 버튼 */}
        <button
          onClick={onClose}
          style={{
            position: "absolute",
            top: "16px",
            right: "16px",
            background: "none",
            border: "none",
            cursor: "pointer",
            color: "#94A3B8",
            padding: "4px",
          }}
        >
          <X size={18} />
        </button>

        {/* 브랜드 */}
        <div style={{ textAlign: "center", marginBottom: "28px" }}>
          <p
            style={{
              fontSize: "20px",
              fontFamily: "'Pretendard', sans-serif",
              fontWeight: 700,
              color: "#0F172A",
              lineHeight: 1,
            }}
          >
            선익
          </p>
          <p
            style={{
              fontSize: "11px",
              fontFamily: "Inter, sans-serif",
              fontWeight: 600,
              color: "#94A3B8",
              letterSpacing: "0.15em",
              marginTop: "3px",
            }}
          >
            SEONIK
          </p>
        </div>

        {/* 탭 */}
        <div
          style={{
            display: "flex",
            borderBottom: "1px solid #E2E8F0",
            marginBottom: "28px",
          }}
        >
          {(["login", "signup"] as const).map((t) => (
            <button
              key={t}
              onClick={() => { setTab(t); setError(""); }}
              style={{
                flex: 1,
                padding: "10px",
                background: "none",
                border: "none",
                cursor: "pointer",
                fontSize: "14px",
                fontFamily: "'Pretendard', sans-serif",
                fontWeight: tab === t ? 700 : 400,
                color: tab === t ? "#0F172A" : "#94A3B8",
                borderBottom: tab === t ? "2px solid #0F172A" : "2px solid transparent",
                marginBottom: "-1px",
              }}
            >
              {t === "login" ? "로그인" : "회원가입"}
            </button>
          ))}
        </div>

        {/* 에러 */}
        {error && (
          <p
            style={{
              fontSize: "13px",
              color: "#EF4444",
              fontFamily: "'Pretendard', sans-serif",
              marginBottom: "16px",
              textAlign: "center",
            }}
          >
            {error}
          </p>
        )}

        {/* 로그인 폼 */}
        {tab === "login" && (
          <form onSubmit={handleLogin} style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
            <input
              type="email"
              placeholder="이메일"
              value={loginEmail}
              onChange={(e) => setLoginEmail(e.target.value)}
              required
              style={inputStyle}
            />
            <input
              type="password"
              placeholder="비밀번호"
              value={loginPassword}
              onChange={(e) => setLoginPassword(e.target.value)}
              required
              style={inputStyle}
            />
            <button type="submit" disabled={loading} style={{ ...btnPrimaryStyle, marginTop: "4px" }}>
              {loading ? "로그인 중..." : "로그인"}
            </button>
          </form>
        )}

        {/* 회원가입 폼 */}
        {tab === "signup" && (
          <form onSubmit={handleSignup} style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
            <input
              type="text"
              placeholder="이름 (선택)"
              value={signupName}
              onChange={(e) => setSignupName(e.target.value)}
              style={inputStyle}
            />
            <input
              type="email"
              placeholder="이메일"
              value={signupEmail}
              onChange={(e) => setSignupEmail(e.target.value)}
              required
              style={inputStyle}
            />
            <input
              type="password"
              placeholder="비밀번호 (6자 이상)"
              value={signupPassword}
              onChange={(e) => setSignupPassword(e.target.value)}
              required
              style={inputStyle}
            />
            <input
              type="password"
              placeholder="비밀번호 확인"
              value={signupConfirm}
              onChange={(e) => setSignupConfirm(e.target.value)}
              required
              style={inputStyle}
            />
            <button type="submit" disabled={loading} style={{ ...btnPrimaryStyle, marginTop: "4px" }}>
              {loading ? "가입 중..." : "회원가입"}
            </button>
          </form>
        )}

        {/* 탭 전환 링크 */}
        <p
          style={{
            textAlign: "center",
            fontSize: "13px",
            fontFamily: "'Pretendard', sans-serif",
            color: "#94A3B8",
            marginTop: "20px",
          }}
        >
          {tab === "login" ? (
            <>
              계정이 없으신가요?{" "}
              <button
                onClick={() => { setTab("signup"); setError(""); }}
                style={{
                  background: "none",
                  border: "none",
                  cursor: "pointer",
                  color: "#0F172A",
                  fontWeight: 600,
                  fontSize: "13px",
                  fontFamily: "'Pretendard', sans-serif",
                }}
              >
                회원가입
              </button>
            </>
          ) : (
            <>
              이미 계정이 있으신가요?{" "}
              <button
                onClick={() => { setTab("login"); setError(""); }}
                style={{
                  background: "none",
                  border: "none",
                  cursor: "pointer",
                  color: "#0F172A",
                  fontWeight: 600,
                  fontSize: "13px",
                  fontFamily: "'Pretendard', sans-serif",
                }}
              >
                로그인
              </button>
            </>
          )}
        </p>
      </div>
    </div>
  );
}

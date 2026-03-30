"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { signIn, getSession } from "next-auth/react";
import { X, Lock } from "lucide-react";

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  defaultTab?: "login" | "signup";
}

const OCCUPATION_OPTIONS = ["학생", "직장인", "창업가/사업가", "프리랜서", "연구자/학자", "기타"];
const HOW_FOUND_OPTIONS = ["지인 추천", "SNS", "검색엔진", "뉴스/미디어", "기타"];
const JOIN_REASON_OPTIONS = ["비즈니스 인텔리전스", "시장 분석", "트렌드 파악", "AI 활용 정보", "기타"];

type LoginView = "form" | "findEmail" | "findEmailDone" | "forgotPw" | "forgotPwDone";

export default function AuthModal({ isOpen, onClose, defaultTab = "login" }: AuthModalProps) {
  const backdropMouseDown = useRef(false);
  const [tab, setTab] = useState<"login" | "signup">(defaultTab);
  const [signupStep, setSignupStep] = useState<1 | 2 | 3>(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // 로그인 상태
  const [loginEmail, setLoginEmail] = useState("");
  const [loginPassword, setLoginPassword] = useState("");
  const [rememberEmail, setRememberEmail] = useState(false);
  const [loginView, setLoginView] = useState<LoginView>("form");
  const [showRecovery, setShowRecovery] = useState(false);
  const [lockedSeconds, setLockedSeconds] = useState(0);

  // 이메일 찾기
  const [findEmailName, setFindEmailName] = useState("");
  // 비밀번호 찾기
  const [forgotPwName, setForgotPwName] = useState("");
  const [forgotPwEmail, setForgotPwEmail] = useState("");

  // 회원가입 상태
  const [signupName, setSignupName] = useState("");
  const [signupEmail, setSignupEmail] = useState("");
  const [signupPassword, setSignupPassword] = useState("");
  const [signupConfirm, setSignupConfirm] = useState("");
  const [verifyCode, setVerifyCode] = useState("");
  const [resendCooldown, setResendCooldown] = useState(0);

  const [occupation, setOccupation] = useState("");
  const [occupationOther, setOccupationOther] = useState("");
  const [howFound, setHowFound] = useState("");
  const [howFoundOther, setHowFoundOther] = useState("");
  const [joinReason, setJoinReason] = useState("");
  const [joinReasonOther, setJoinReasonOther] = useState("");
  const [newsletterConsent, setNewsletterConsent] = useState(false);
  const [privacyConsent, setPrivacyConsent] = useState(false);
  const [privacyScrolled, setPrivacyScrolled] = useState(false);
  const [disclaimerConsent, setDisclaimerConsent] = useState(false);
  const [disclaimerScrolled, setDisclaimerScrolled] = useState(false);
  const [ageConsent, setAgeConsent] = useState(false);

  // 잠금 카운트다운
  useEffect(() => {
    if (lockedSeconds <= 0) return;
    const t = setTimeout(() => setLockedSeconds((s) => s - 1), 1000);
    return () => clearTimeout(t);
  }, [lockedSeconds]);

  // 재발송 쿨다운
  useEffect(() => {
    if (resendCooldown <= 0) return;
    const t = setTimeout(() => setResendCooldown((c) => c - 1), 1000);
    return () => clearTimeout(t);
  }, [resendCooldown]);

  // 아이디 저장 복원
  useEffect(() => {
    try {
      const saved = localStorage.getItem("seonik_saved_email");
      if (saved) { setLoginEmail(saved); setRememberEmail(true); }
    } catch {}
  }, []);

  // 모달 열릴 때 상태 초기화
  useEffect(() => {
    setTab(defaultTab);
    setSignupStep(1);
    setError("");
    setVerifyCode("");
    setResendCooldown(0);
    setLoginView("form");
    setShowRecovery(false);
    setLockedSeconds(0);
    setPrivacyScrolled(false);
    setPrivacyConsent(false);
    setDisclaimerScrolled(false);
    setDisclaimerConsent(false);
    setAgeConsent(false);
    setFindEmailName("");
    setForgotPwName("");
    setForgotPwEmail("");
  }, [defaultTab, isOpen]);

  useEffect(() => {
    document.body.style.overflow = isOpen ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [isOpen]);

  const handleEsc = useCallback((e: KeyboardEvent) => {
    if (e.key === "Escape") onClose();
  }, [onClose]);

  useEffect(() => {
    window.addEventListener("keydown", handleEsc);
    return () => window.removeEventListener("keydown", handleEsc);
  }, [handleEsc]);

  // 개인정보처리방침 스크롤 감지
  const handlePrivacyScroll = (e: React.UIEvent<HTMLDivElement>) => {
    const el = e.currentTarget;
    if (el.scrollHeight - el.scrollTop <= el.clientHeight + 8) {
      setPrivacyScrolled(true);
    }
  };

  // 면책 조항 스크롤 감지
  const handleDisclaimerScroll = (e: React.UIEvent<HTMLDivElement>) => {
    const el = e.currentTarget;
    if (el.scrollHeight - el.scrollTop <= el.clientHeight + 8) {
      setDisclaimerScrolled(true);
    }
  };

  // 로그인 처리
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (lockedSeconds > 0) return;
    setLoading(true);
    setError("");
    setShowRecovery(false);

    const result = await signIn("credentials", {
      email: loginEmail, password: loginPassword, redirect: false,
    });

    if (result?.error) {
      // 잠금 여부 확인
      try {
        const res = await fetch(`/api/auth/check-lockout?email=${encodeURIComponent(loginEmail)}`);
        const data = await res.json();
        if (data.locked && data.remainingSeconds > 0) {
          setLockedSeconds(data.remainingSeconds);
          setError("");
        } else {
          setError("이메일 또는 비밀번호가 올바르지 않습니다.");
          setShowRecovery(true);
        }
      } catch {
        setError("이메일 또는 비밀번호가 올바르지 않습니다.");
        setShowRecovery(true);
      }
    } else {
      try {
        if (rememberEmail) localStorage.setItem("seonik_saved_email", loginEmail);
        else localStorage.removeItem("seonik_saved_email");
      } catch {}
      // mustResetPassword 여부 확인 후 리다이렉트
      try {
        const sess = await getSession();
        if ((sess?.user as { mustResetPassword?: boolean })?.mustResetPassword) {
          onClose();
          window.location.href = "/change-password";
          return;
        }
      } catch {}
      onClose();
      window.location.reload();
    }
    setLoading(false);
  };

  // 이메일 찾기
  const handleFindEmail = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!findEmailName.trim()) { setError("이름을 입력해 주세요."); return; }
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/auth/find-email", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: findEmailName }),
      });
      const data = await res.json();
      if (!res.ok) { setError(data.error || "이메일 찾기에 실패했습니다."); }
      else { setLoginView("findEmailDone"); }
    } catch {
      setError("네트워크 오류가 발생했습니다.");
    }
    setLoading(false);
  };

  // 비밀번호 찾기 (임시 비밀번호 발송)
  const handleForgotPw = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!forgotPwName.trim()) { setError("이름을 입력해 주세요."); return; }
    if (!forgotPwEmail.trim()) { setError("이메일을 입력해 주세요."); return; }
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/auth/forgot-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: forgotPwName, email: forgotPwEmail }),
      });
      const data = await res.json();
      if (!res.ok) { setError(data.error || "비밀번호 재설정에 실패했습니다."); }
      else { setLoginView("forgotPwDone"); }
    } catch {
      setError("네트워크 오류가 발생했습니다.");
    }
    setLoading(false);
  };

  // 회원가입 Step 1
  const handleStep1 = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    if (!signupName.trim()) { setError("이름을 입력해 주세요."); return; }
    if (!signupEmail.trim()) { setError("이메일을 입력해 주세요."); return; }
    if (signupPassword !== signupConfirm) { setError("비밀번호가 일치하지 않습니다."); return; }
    if (signupPassword.length < 6) { setError("비밀번호는 6자 이상이어야 합니다."); return; }
    if (!ageConsent) { setError("만 14세 이상인 경우에만 가입하실 수 있습니다."); return; }
    if (!privacyScrolled) { setError("개인정보처리방침을 끝까지 읽어주세요."); return; }
    if (!privacyConsent) { setError("개인정보처리방침에 동의해 주세요."); return; }
    if (!disclaimerScrolled) { setError("면책 조항을 끝까지 읽어주세요."); return; }
    if (!disclaimerConsent) { setError("면책 조항에 동의해 주세요."); return; }

    setLoading(true);
    try {
      // 이름 중복 확인
      const nameRes = await fetch("/api/auth/check-name", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: signupName }),
      });
      const nameData = await nameRes.json();
      if (nameData.taken) {
        setError("기존 회원과 중복된 이름입니다. 다른 이름을 입력해주세요.");
        setLoading(false);
        return;
      }

      const res = await fetch("/api/auth/send-verification", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: signupEmail }),
      });
      const data = await res.json();
      if (!res.ok) { setError(data.error || "인증 코드 발송에 실패했습니다."); setLoading(false); return; }
      setVerifyCode("");
      setResendCooldown(60);
      setSignupStep(2);
    } catch {
      setError("네트워크 오류가 발생했습니다.");
    }
    setLoading(false);
  };

  // 이메일 인증
  const handleVerify = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    if (!verifyCode.trim()) { setError("인증 코드를 입력해 주세요."); return; }
    setLoading(true);
    try {
      const res = await fetch("/api/auth/verify-code", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: signupEmail, code: verifyCode }),
      });
      const data = await res.json();
      if (!res.ok) { setError(data.error || "인증에 실패했습니다."); setLoading(false); return; }
      setSignupStep(3);
    } catch {
      setError("네트워크 오류가 발생했습니다.");
    }
    setLoading(false);
  };

  const handleResend = async () => {
    if (resendCooldown > 0) return;
    setError("");
    setLoading(true);
    try {
      const res = await fetch("/api/auth/send-verification", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: signupEmail }),
      });
      const data = await res.json();
      if (!res.ok) { setError(data.error || "재발송에 실패했습니다."); }
      else { setResendCooldown(60); setError(""); }
    } catch {
      setError("네트워크 오류가 발생했습니다.");
    }
    setLoading(false);
  };

  const getFinalValue = (value: string, other: string) =>
    value === "기타" ? (other.trim() || "기타") : value;

  // 회원가입 최종 Step 3
  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    if (!occupation) { setError("직업을 선택해 주세요."); return; }
    if (occupation === "기타" && !occupationOther.trim()) { setError("직업을 직접 입력해 주세요."); return; }
    if (!howFound) { setError("선익을 알게 된 경로를 선택해 주세요."); return; }
    if (howFound === "기타" && !howFoundOther.trim()) { setError("알게 된 경로를 직접 입력해 주세요."); return; }
    if (!joinReason) { setError("가입 이유를 선택해 주세요."); return; }
    if (joinReason === "기타" && !joinReasonOther.trim()) { setError("가입 이유를 직접 입력해 주세요."); return; }
    setLoading(true);
    const res = await fetch("/api/auth/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: signupName,
        email: signupEmail,
        password: signupPassword,
        occupation: getFinalValue(occupation, occupationOther),
        howFound: getFinalValue(howFound, howFoundOther),
        joinReason: getFinalValue(joinReason, joinReasonOther),
        newsletterConsent,
        privacyConsent,
      }),
    });
    const data = await res.json();
    setLoading(false);
    if (!res.ok) { setError(data.error || "회원가입에 실패했습니다."); return; }
    const result = await signIn("credentials", { email: signupEmail, password: signupPassword, redirect: false });
    if (result?.ok) { onClose(); window.location.reload(); }
    else { setTab("login"); setSignupStep(1); setError("가입이 완료되었습니다. 로그인해 주세요."); }
  };

  if (!isOpen) return null;

  const inputStyle: React.CSSProperties = {
    width: "100%", padding: "10px 14px", border: "1px solid #E2E8F0",
    outline: "none", fontSize: "14px", fontFamily: "'Pretendard', sans-serif",
    color: "#0F172A", backgroundColor: "#F8FAFC", borderRadius: 0, boxSizing: "border-box",
  };

  const btnPrimary: React.CSSProperties = {
    width: "100%", padding: "12px", backgroundColor: "#0F172A", color: "white",
    border: "none", cursor: loading ? "not-allowed" : "pointer",
    fontSize: "14px", fontFamily: "'Pretendard', sans-serif", fontWeight: 600,
    opacity: loading ? 0.6 : 1, borderRadius: 0,
  };

  const subLinkStyle: React.CSSProperties = {
    background: "none", border: "none", cursor: "pointer", fontSize: "12px",
    color: "#64748B", fontFamily: "'Pretendard', sans-serif", textDecoration: "underline",
    textDecorationColor: "#CBD5E1", padding: 0,
  };

  const mins = Math.floor(lockedSeconds / 60);
  const secs = lockedSeconds % 60;

  return (
    <div
      style={{
        position: "fixed", inset: 0, zIndex: 300, display: "flex",
        alignItems: "center", justifyContent: "center", padding: "20px",
        backgroundColor: "rgba(15, 23, 42, 0.6)", backdropFilter: "blur(4px)",
      }}
      onMouseDown={(e) => { backdropMouseDown.current = e.target === e.currentTarget; }}
      onClick={(e) => { if (backdropMouseDown.current && e.target === e.currentTarget) onClose(); }}
    >
      <div style={{
        backgroundColor: "white", width: "100%", maxWidth: "420px",
        padding: "40px 36px", position: "relative", maxHeight: "90vh", overflowY: "auto",
      }}>
        <button onClick={onClose} style={{
          position: "absolute", top: "16px", right: "16px", background: "none",
          border: "none", cursor: "pointer", color: "#94A3B8", padding: "4px",
        }}>
          <X size={18} />
        </button>

        <div style={{ textAlign: "center", marginBottom: "28px" }}>
          <div style={{ display: "flex", justifyContent: "center", marginBottom: "12px" }}>
            <svg width="42" height="42" viewBox="0 0 166 166" fill="none" xmlns="http://www.w3.org/2000/svg">
              <rect y="24.6818" width="141" height="141" fill="#E2E8F0"/>
              <path d="M165.156 0.5V136.585H140.93L140.931 136.084L141.142 41.8418L18.4197 164.776L18.0652 165.131L17.7117 164.776L1.09251 148.157L0.738998 147.805L1.09251 147.451L123.82 24.5117H29.0661L29.071 24.0068L29.2839 0.995117L29.2888 0.5H165.156Z" fill="#0F172A" stroke="#0F172A" strokeWidth="0.5"/>
            </svg>
          </div>
          <p style={{ fontSize: "20px", fontFamily: "'Pretendard', sans-serif", fontWeight: 700, color: "#0F172A", lineHeight: 1 }}>선익</p>
          <p style={{ fontSize: "11px", fontFamily: "Inter, sans-serif", fontWeight: 600, color: "#94A3B8", letterSpacing: "0.15em", marginTop: "3px" }}>SEONIK</p>
        </div>

        {/* 탭 (이메일 찾기/비밀번호 찾기 뷰에서는 숨김) */}
        {(loginView === "form" || tab === "signup") && (
          <div style={{ display: "flex", borderBottom: "1px solid #E2E8F0", marginBottom: "28px" }}>
            {(["login", "signup"] as const).map((t) => (
              <button key={t}
                onClick={() => { setTab(t); setSignupStep(1); setVerifyCode(""); setResendCooldown(0); setError(""); setLoginView("form"); setShowRecovery(false); setLockedSeconds(0); setPrivacyScrolled(false); setPrivacyConsent(false); setDisclaimerScrolled(false); setDisclaimerConsent(false); setAgeConsent(false); }}
                style={{
                  flex: 1, padding: "10px", background: "none", border: "none", cursor: "pointer",
                  fontSize: "14px", fontFamily: "'Pretendard', sans-serif",
                  fontWeight: tab === t ? 700 : 400, color: tab === t ? "#0F172A" : "#94A3B8",
                  borderBottom: tab === t ? "2px solid #0F172A" : "2px solid transparent", marginBottom: "-1px",
                }}>
                {t === "login" ? "로그인" : "회원가입"}
              </button>
            ))}
          </div>
        )}

        {error && (
          <p style={{ fontSize: "13px", color: "#EF4444", fontFamily: "'Pretendard', sans-serif", marginBottom: "16px", textAlign: "center" }}>
            {error}
          </p>
        )}

        {/* ── 로그인: 기본 폼 ── */}
        {tab === "login" && loginView === "form" && (
          <>
            {/* 계정 잠금 표시 */}
            {lockedSeconds > 0 && (
              <div style={{ display: "flex", alignItems: "center", gap: "10px", backgroundColor: "#FEF2F2", border: "1px solid #FECACA", padding: "14px 16px", marginBottom: "16px" }}>
                <Lock size={16} color="#EF4444" style={{ flexShrink: 0 }} />
                <div>
                  <p style={{ fontSize: "13px", fontFamily: "'Pretendard', sans-serif", fontWeight: 700, color: "#DC2626", marginBottom: "2px" }}>
                    로그인이 일시 잠겼습니다
                  </p>
                  <p style={{ fontSize: "12px", fontFamily: "'Pretendard', sans-serif", color: "#EF4444" }}>
                    {mins > 0 ? `${mins}분 ${secs}초` : `${secs}초`} 후 다시 시도해 주세요.
                  </p>
                </div>
              </div>
            )}

            <form onSubmit={handleLogin} style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
              <input type="email" placeholder="이메일" value={loginEmail}
                onChange={(e) => setLoginEmail(e.target.value)} required style={inputStyle} />
              <input type="password" placeholder="비밀번호" value={loginPassword}
                onChange={(e) => setLoginPassword(e.target.value)} required style={inputStyle} />
              <label style={{ display: "flex", alignItems: "center", gap: "8px", cursor: "pointer" }}>
                <input type="checkbox" checked={rememberEmail} onChange={(e) => setRememberEmail(e.target.checked)}
                  style={{ width: "14px", height: "14px", cursor: "pointer" }} />
                <span style={{ fontSize: "12px", color: "#64748B", fontFamily: "'Pretendard', sans-serif" }}>아이디 저장</span>
              </label>
              <button type="submit" disabled={loading || lockedSeconds > 0}
                style={{ ...btnPrimary, marginTop: "4px", opacity: (loading || lockedSeconds > 0) ? 0.5 : 1, cursor: (loading || lockedSeconds > 0) ? "not-allowed" : "pointer" }}>
                {loading ? "로그인 중..." : lockedSeconds > 0 ? `잠금 중 (${mins > 0 ? `${mins}분 ` : ""}${secs}초)` : "로그인"}
              </button>
            </form>

            {/* 계정 찾기 링크 */}
            {showRecovery && (
              <div style={{ marginTop: "16px", padding: "14px 16px", backgroundColor: "#F8F9FA", border: "1px solid #E2E8F0" }}>
                <p style={{ fontSize: "12px", fontFamily: "'Pretendard', sans-serif", color: "#64748B", marginBottom: "10px" }}>
                  계정을 찾는 데 도움이 필요하신가요?
                </p>
                <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                  <button onClick={() => { setLoginView("findEmail"); setError(""); }}
                    style={{ ...subLinkStyle, textAlign: "left" }}>
                    이메일을 잊어버리셨나요? →
                  </button>
                  <button onClick={() => { setLoginView("forgotPw"); setError(""); }}
                    style={{ ...subLinkStyle, textAlign: "left" }}>
                    비밀번호를 잊어버리셨나요? →
                  </button>
                </div>
              </div>
            )}
          </>
        )}

        {/* ── 로그인: 이메일 찾기 폼 ── */}
        {tab === "login" && loginView === "findEmail" && (
          <div>
            <div style={{ marginBottom: "20px" }}>
              <p style={{ fontSize: "15px", fontFamily: "'Pretendard', sans-serif", fontWeight: 700, color: "#0F172A", marginBottom: "6px" }}>이메일 찾기</p>
              <p style={{ fontSize: "13px", fontFamily: "'Pretendard', sans-serif", color: "#94A3B8", lineHeight: "1.6" }}>
                가입 시 입력한 이름을 입력하면 해당 이메일 주소로 이메일을 발송해 드립니다.
              </p>
            </div>
            <form onSubmit={handleFindEmail} style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
              <input type="text" placeholder="가입 시 입력한 이름" value={findEmailName}
                onChange={(e) => setFindEmailName(e.target.value)} required style={inputStyle} />
              <button type="submit" disabled={loading} style={{ ...btnPrimary, marginTop: "4px" }}>
                {loading ? "발송 중..." : "이메일 발송"}
              </button>
            </form>
            <button onClick={() => { setLoginView("form"); setError(""); }}
              style={{ ...subLinkStyle, marginTop: "14px", display: "block", textAlign: "center", width: "100%" }}>
              ← 로그인으로 돌아가기
            </button>
          </div>
        )}

        {/* ── 로그인: 이메일 찾기 완료 ── */}
        {tab === "login" && loginView === "findEmailDone" && (
          <div style={{ textAlign: "center" }}>
            <div style={{ width: "48px", height: "48px", backgroundColor: "#F0FDF4", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 16px", fontSize: "22px" }}>✓</div>
            <p style={{ fontSize: "15px", fontFamily: "'Pretendard', sans-serif", fontWeight: 700, color: "#0F172A", marginBottom: "8px" }}>이메일을 발송했습니다</p>
            <p style={{ fontSize: "13px", fontFamily: "'Pretendard', sans-serif", color: "#64748B", lineHeight: "1.7", marginBottom: "24px" }}>
              가입된 이메일 주소로 안내 메일을 보내드렸습니다.<br />
              받은편지함을 확인해 주세요.
            </p>
            <button onClick={() => { setLoginView("form"); setError(""); }}
              style={{ ...btnPrimary, width: "auto", padding: "10px 28px", display: "inline-block" }}>
              로그인 화면으로
            </button>
          </div>
        )}

        {/* ── 로그인: 비밀번호 찾기 폼 ── */}
        {tab === "login" && loginView === "forgotPw" && (
          <div>
            <div style={{ marginBottom: "20px" }}>
              <p style={{ fontSize: "15px", fontFamily: "'Pretendard', sans-serif", fontWeight: 700, color: "#0F172A", marginBottom: "6px" }}>비밀번호 재설정</p>
              <p style={{ fontSize: "13px", fontFamily: "'Pretendard', sans-serif", color: "#94A3B8", lineHeight: "1.6" }}>
                이름과 이메일이 일치하면 임시 비밀번호를 이메일로 보내드립니다.
              </p>
            </div>
            <form onSubmit={handleForgotPw} style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
              <input type="text" placeholder="가입 시 입력한 이름" value={forgotPwName}
                onChange={(e) => setForgotPwName(e.target.value)} required style={inputStyle} />
              <input type="email" placeholder="가입한 이메일 주소" value={forgotPwEmail}
                onChange={(e) => setForgotPwEmail(e.target.value)} required style={inputStyle} />
              <button type="submit" disabled={loading} style={{ ...btnPrimary, marginTop: "4px" }}>
                {loading ? "발송 중..." : "재설정 코드 발송"}
              </button>
            </form>
            <button onClick={() => { setLoginView("form"); setError(""); }}
              style={{ ...subLinkStyle, marginTop: "14px", display: "block", textAlign: "center", width: "100%" }}>
              ← 로그인으로 돌아가기
            </button>
          </div>
        )}

        {/* ── 로그인: 임시 비밀번호 발송 완료 ── */}
        {tab === "login" && loginView === "forgotPwDone" && (
          <div style={{ textAlign: "center" }}>
            <div style={{ width: "48px", height: "48px", backgroundColor: "#F0FDF4", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 16px", fontSize: "22px" }}>✓</div>
            <p style={{ fontSize: "15px", fontFamily: "'Pretendard', sans-serif", fontWeight: 700, color: "#0F172A", marginBottom: "8px" }}>임시 비밀번호를 발송했습니다</p>
            <div style={{ background: "#F8F9FA", border: "1px solid #E2E8F0", padding: "14px 16px", marginBottom: "20px", textAlign: "left" }}>
              <p style={{ fontSize: "13px", fontFamily: "'Pretendard', sans-serif", color: "#475569", lineHeight: "1.75", margin: 0 }}>
                <strong style={{ color: "#0F172A" }}>① 이메일</strong>에서 임시 비밀번호를 확인하세요.<br />
                <strong style={{ color: "#0F172A" }}>② 임시 비밀번호로 로그인</strong>하면<br />
                &nbsp;&nbsp;&nbsp;새 비밀번호 설정 화면으로 이동합니다.
              </p>
            </div>
            <button onClick={() => { setLoginView("form"); setError(""); }}
              style={{ ...btnPrimary }}>
              로그인 화면으로
            </button>
          </div>
        )}

        {/* ── 회원가입 Step 1 ── */}
        {tab === "signup" && signupStep === 1 && (
          <>
          <form onSubmit={handleStep1} style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
            <p style={{ fontSize: "11px", color: "#94A3B8", fontFamily: "Inter, sans-serif", textAlign: "center", letterSpacing: "0.05em", marginBottom: "4px" }}>
              1 / 3 · 기본 정보
            </p>
            <input type="text" placeholder="이름" value={signupName}
              onChange={(e) => setSignupName(e.target.value)} required style={inputStyle} />
            <input type="email" placeholder="이메일" value={signupEmail}
              onChange={(e) => setSignupEmail(e.target.value)} required style={inputStyle} />
            <input type="password" placeholder="비밀번호 (6자 이상)" value={signupPassword}
              onChange={(e) => setSignupPassword(e.target.value)} required style={inputStyle} />
            <input type="password" placeholder="비밀번호 확인" value={signupConfirm}
              onChange={(e) => setSignupConfirm(e.target.value)} required style={inputStyle} />

            {/* 만 14세 이상 확인 (정보통신망법 제31조) */}
            <label style={{ display: "flex", alignItems: "flex-start", gap: "8px", cursor: "pointer", padding: "10px 12px", backgroundColor: "#F8FAFC", border: `1px solid ${ageConsent ? "#10B981" : "#E2E8F0"}`, transition: "border-color 0.2s" }}>
              <input type="checkbox" checked={ageConsent} onChange={(e) => setAgeConsent(e.target.checked)}
                style={{ width: "14px", height: "14px", cursor: "pointer", marginTop: "1px", flexShrink: 0 }} />
              <span style={{ fontSize: "12px", color: "#0F172A", fontFamily: "'Pretendard', sans-serif", lineHeight: "1.6" }}>
                본인은 <strong>만 14세 이상</strong>임을 확인합니다.{" "}
                <span style={{ color: "#EF4444", fontWeight: 600 }}>(필수)</span>
                <br />
                <span style={{ color: "#94A3B8", fontSize: "11px" }}>만 14세 미만은 「정보통신망법」에 따라 가입이 제한됩니다.</span>
              </span>
            </label>

            {/* 개인정보처리방침 필독 영역 */}
            <div>
              <label style={{ fontSize: "12px", color: "#64748B", fontFamily: "'Pretendard', sans-serif", display: "block", marginBottom: "6px", fontWeight: 600 }}>
                개인정보처리방침 <span style={{ color: "#EF4444" }}>(필수 — 끝까지 읽어주세요)</span>
              </label>
              <div
                onScroll={handlePrivacyScroll}
                style={{
                  height: "130px", overflowY: "auto", border: `1px solid ${privacyScrolled ? "#10B981" : "#E2E8F0"}`,
                  padding: "12px 14px", backgroundColor: "#F8FAFC", fontSize: "11px",
                  fontFamily: "'Pretendard', sans-serif", color: "#64748B", lineHeight: "1.85",
                  transition: "border-color 0.2s",
                }}
              >
                <p style={{ fontWeight: 700, color: "#0F172A", marginBottom: "6px", fontSize: "12px" }}>개인정보처리방침 요약</p>
                <p><strong>수집 항목:</strong> 이름, 이메일, 비밀번호(암호화 저장), 직업, 선익을 알게 된 경로, 가입 이유.</p>
                <br />
                <p><strong>수집 목적:</strong> 회원 식별 및 서비스 제공, 맞춤형 콘텐츠 추천, 서비스 개선.</p>
                <br />
                <p><strong>보유 기간:</strong> 회원 탈퇴 시 즉시 삭제. 이메일 수신 동의 기록은 수신거부 후 6개월간 보관 (정보통신망법 제50조의5).</p>
                <br />
                <p><strong>제3자 제공:</strong> 원칙적으로 제3자에게 제공하지 않습니다. 법령에 의거한 경우는 예외입니다.</p>
                <br />
                <p><strong>처리 위탁:</strong> Vercel Inc.(호스팅), Neon Inc.(DB), Google LLC(이메일 발송), Vercel Blob(이미지 저장).</p>
                <br />
                <p><strong>이용자 권리:</strong> 개인정보 열람·수정·삭제·이메일 수신 거부는 마이페이지에서 직접 처리 가능합니다.</p>
                <br />
                <p><strong>개인정보 보호책임자:</strong> 선익 운영팀 (seonik.official@gmail.com)</p>
                <br />
                <p style={{ color: privacyScrolled ? "#10B981" : "#94A3B8", fontWeight: 600 }}>
                  {privacyScrolled ? "✓ 읽기 완료 — 아래에서 동의해 주세요." : "↓ 끝까지 스크롤하면 동의가 활성화됩니다."}
                </p>
              </div>
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginTop: "8px" }}>
                <label style={{
                  display: "flex", alignItems: "center", gap: "8px",
                  cursor: privacyScrolled ? "pointer" : "not-allowed",
                  opacity: privacyScrolled ? 1 : 0.45,
                }}>
                  <input type="checkbox" checked={privacyConsent}
                    onChange={(e) => { if (privacyScrolled) setPrivacyConsent(e.target.checked); }}
                    disabled={!privacyScrolled}
                    style={{ width: "14px", height: "14px", cursor: privacyScrolled ? "pointer" : "not-allowed" }} />
                  <span style={{ fontSize: "12px", color: "#64748B", fontFamily: "'Pretendard', sans-serif", lineHeight: "1.5" }}>
                    위 내용을 읽었으며 동의합니다
                  </span>
                </label>
                <a href="/privacy" target="_blank" rel="noopener noreferrer"
                  style={{ fontSize: "11px", color: "#94A3B8", fontFamily: "'Pretendard', sans-serif", textDecoration: "none", flexShrink: 0 }}>
                  전체 보기 →
                </a>
              </div>
            </div>

            {/* 면책 조항 필독 영역 */}
            <div>
              <label style={{ fontSize: "12px", color: "#64748B", fontFamily: "'Pretendard', sans-serif", display: "block", marginBottom: "6px", fontWeight: 600 }}>
                면책 조항 <span style={{ color: "#EF4444" }}>(필수 — 끝까지 읽어주세요)</span>
              </label>
              <div
                onScroll={handleDisclaimerScroll}
                style={{
                  height: "130px", overflowY: "auto", border: `1px solid ${disclaimerScrolled ? "#10B981" : "#E2E8F0"}`,
                  padding: "12px 14px", backgroundColor: "#F8FAFC", fontSize: "11px",
                  fontFamily: "'Pretendard', sans-serif", color: "#64748B", lineHeight: "1.85",
                  transition: "border-color 0.2s",
                }}
              >
                <p style={{ fontWeight: 700, color: "#0F172A", marginBottom: "6px", fontSize: "12px" }}>면책 조항 요약</p>
                <p><strong>콘텐츠 성격:</strong> 선익(SEONIK)의 모든 브리핑 콘텐츠는 정보 제공 목적으로만 제공됩니다. 투자 권유, 법률 자문, 세무 조언, 경영 컨설팅이 아닙니다.</p>
                <br />
                <p><strong>투자·재무:</strong> 어떠한 경우에도 투자 권유나 금융 상품 추천으로 해석되어서는 안 됩니다. 모든 투자 결정은 이용자 본인의 판단과 책임 하에 이루어져야 합니다.</p>
                <br />
                <p><strong>법률·세무:</strong> 콘텐츠 내 법률·세무 정보는 일반적인 참고 정보로, 전문가의 법적 자문을 대체하지 않습니다.</p>
                <br />
                <p><strong>정확성 보증 불가:</strong> 회사는 콘텐츠의 정확성·완전성·최신성에 대해 보증하지 않습니다. AI 분석 특성상 사실과 다른 내용이 포함될 수 있습니다.</p>
                <br />
                <p><strong>수익 보증 불가:</strong> 서비스 이용이 특정 사업 성과나 투자 수익을 보장하지 않습니다.</p>
                <br />
                <p><strong>준거법:</strong> 본 면책 조항은 대한민국 법률을 준거법으로 합니다.</p>
                <br />
                <p style={{ color: disclaimerScrolled ? "#10B981" : "#94A3B8", fontWeight: 600 }}>
                  {disclaimerScrolled ? "✓ 읽기 완료 — 아래에서 동의해 주세요." : "↓ 끝까지 스크롤하면 동의가 활성화됩니다."}
                </p>
              </div>
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginTop: "8px" }}>
                <label style={{
                  display: "flex", alignItems: "center", gap: "8px",
                  cursor: disclaimerScrolled ? "pointer" : "not-allowed",
                  opacity: disclaimerScrolled ? 1 : 0.45,
                }}>
                  <input type="checkbox" checked={disclaimerConsent}
                    onChange={(e) => { if (disclaimerScrolled) setDisclaimerConsent(e.target.checked); }}
                    disabled={!disclaimerScrolled}
                    style={{ width: "14px", height: "14px", cursor: disclaimerScrolled ? "pointer" : "not-allowed" }} />
                  <span style={{ fontSize: "12px", color: "#64748B", fontFamily: "'Pretendard', sans-serif", lineHeight: "1.5" }}>
                    위 내용을 읽었으며 동의합니다
                  </span>
                </label>
                <a href="/disclaimer" target="_blank" rel="noopener noreferrer"
                  style={{ fontSize: "11px", color: "#94A3B8", fontFamily: "'Pretendard', sans-serif", textDecoration: "none", flexShrink: 0 }}>
                  전체 보기 →
                </a>
              </div>
            </div>

            <button type="submit" disabled={loading} style={{ ...btnPrimary, marginTop: "4px" }}>
              {loading ? "확인 중..." : "다음 →"}
            </button>
          </form>
          </>
        )}

        {/* ── 회원가입 Step 2: 이메일 인증 ── */}
        {tab === "signup" && signupStep === 2 && (
          <form onSubmit={handleVerify} style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
            <p style={{ fontSize: "11px", color: "#94A3B8", fontFamily: "Inter, sans-serif", textAlign: "center", letterSpacing: "0.05em" }}>
              2 / 3 · 이메일 인증
            </p>
            <div style={{ background: "#F8F9FA", border: "1px solid #E2E8F0", padding: "14px 16px" }}>
              <p style={{ fontSize: "13px", fontFamily: "'Pretendard', sans-serif", color: "#475569", lineHeight: 1.6 }}>
                <strong style={{ color: "#0F172A" }}>{signupEmail}</strong>으로<br />인증 코드를 발송했습니다. 10분 이내에 입력해 주세요.
              </p>
            </div>
            <input
              type="text" placeholder="인증 코드 6자리" value={verifyCode}
              onChange={(e) => setVerifyCode(e.target.value.replace(/\D/g, "").slice(0, 6))}
              required maxLength={6}
              style={{ ...inputStyle, textAlign: "center", fontSize: "22px", letterSpacing: "0.3em", fontFamily: "monospace" }}
            />
            <button type="submit" disabled={loading} style={{ ...btnPrimary, marginTop: "4px" }}>
              {loading ? "확인 중..." : "인증 확인"}
            </button>
            <div style={{ textAlign: "center" }}>
              <button type="button" onClick={handleResend} disabled={resendCooldown > 0 || loading}
                style={{
                  background: "none", border: "none",
                  cursor: resendCooldown > 0 ? "not-allowed" : "pointer",
                  fontSize: "12px", color: resendCooldown > 0 ? "#CBD5E1" : "#64748B",
                  fontFamily: "'Pretendard', sans-serif",
                }}>
                {resendCooldown > 0 ? `재발송 (${resendCooldown}초 후)` : "코드 재발송"}
              </button>
            </div>
            <button type="button" onClick={() => { setSignupStep(1); setError(""); }}
              style={{ background: "none", border: "none", cursor: "pointer", fontSize: "12px", color: "#94A3B8", fontFamily: "'Pretendard', sans-serif", textAlign: "center" }}>
              ← 이전으로
            </button>
          </form>
        )}

        {/* ── 회원가입 Step 3 ── */}
        {tab === "signup" && signupStep === 3 && (
          <form onSubmit={handleSignup} style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
            <p style={{ fontSize: "11px", color: "#94A3B8", fontFamily: "Inter, sans-serif", textAlign: "center", letterSpacing: "0.05em" }}>
              3 / 3 · 추가 정보 (필수)
            </p>

            {[
              { label: "직업", value: occupation, setValue: setOccupation, other: occupationOther, setOther: setOccupationOther, options: OCCUPATION_OPTIONS },
              { label: "선익을 어디서 알게 되셨나요?", value: howFound, setValue: setHowFound, other: howFoundOther, setOther: setHowFoundOther, options: HOW_FOUND_OPTIONS },
              { label: "가입 이유", value: joinReason, setValue: setJoinReason, other: joinReasonOther, setOther: setJoinReasonOther, options: JOIN_REASON_OPTIONS },
            ].map(({ label, value, setValue, other, setOther, options }) => (
              <div key={label} style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
                <label style={{ fontSize: "12px", color: "#64748B", fontFamily: "'Pretendard', sans-serif" }}>{label}</label>
                <select value={value} onChange={(e) => setValue(e.target.value)}
                  style={{ ...inputStyle, cursor: "pointer" }}>
                  <option value="">선택하세요</option>
                  {options.map((o) => <option key={o} value={o}>{o}</option>)}
                </select>
                {value === "기타" && (
                  <input type="text" placeholder="직접 입력" value={other}
                    onChange={(e) => setOther(e.target.value)} style={inputStyle} />
                )}
              </div>
            ))}

            <label style={{ display: "flex", alignItems: "flex-start", gap: "8px", cursor: "pointer" }}>
              <input type="checkbox" checked={newsletterConsent} onChange={(e) => setNewsletterConsent(e.target.checked)}
                style={{ width: "14px", height: "14px", cursor: "pointer", marginTop: "1px", flexShrink: 0 }} />
              <span style={{ fontSize: "12px", color: "#64748B", fontFamily: "'Pretendard', sans-serif", lineHeight: "1.5" }}>
                새 브리핑 발행 시 이메일로 알림 받기 <span style={{ color: "#CBD5E1" }}>(선택)</span>
              </span>
            </label>

            <div style={{ display: "flex", gap: "8px", marginTop: "4px" }}>
              <button type="button" onClick={() => { setSignupStep(2); setError(""); }}
                style={{
                  flex: 1, padding: "12px", backgroundColor: "white", color: "#0F172A",
                  border: "1px solid #E2E8F0", cursor: "pointer", fontSize: "14px",
                  fontFamily: "'Pretendard', sans-serif", fontWeight: 500, borderRadius: 0,
                }}>
                ← 이전
              </button>
              <button type="submit" disabled={loading}
                style={{ flex: 2, ...btnPrimary, width: "auto" }}>
                {loading ? "가입 중..." : "가입 완료"}
              </button>
            </div>
          </form>
        )}

        {/* 하단 탭 전환 (이메일 찾기/비밀번호 찾기 뷰에서는 숨김) */}
        {loginView === "form" && (
          <p style={{ textAlign: "center", fontSize: "13px", fontFamily: "'Pretendard', sans-serif", color: "#94A3B8", marginTop: "20px" }}>
            {tab === "login" ? (
              <>계정이 없으신가요?{" "}
                <button
                  onClick={() => { setTab("signup"); setSignupStep(1); setError(""); setLoginView("form"); setShowRecovery(false); setLockedSeconds(0); }}
                  style={{ background: "none", border: "none", cursor: "pointer", color: "#0F172A", fontWeight: 600, fontSize: "13px", fontFamily: "'Pretendard', sans-serif" }}>
                  회원가입
                </button>
              </>
            ) : (
              <>이미 계정이 있으신가요?{" "}
                <button onClick={() => { setTab("login"); setError(""); setLoginView("form"); setShowRecovery(false); }}
                  style={{ background: "none", border: "none", cursor: "pointer", color: "#0F172A", fontWeight: 600, fontSize: "13px", fontFamily: "'Pretendard', sans-serif" }}>
                  로그인
                </button>
              </>
            )}
          </p>
        )}
      </div>
    </div>
  );
}

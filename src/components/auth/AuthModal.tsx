"use client";

import { useState, useEffect, useCallback } from "react";
import { signIn } from "next-auth/react";
import { X } from "lucide-react";

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  defaultTab?: "login" | "signup";
}

const OCCUPATION_OPTIONS = ["학생", "직장인", "창업가/사업가", "프리랜서", "연구자/학자", "기타"];
const HOW_FOUND_OPTIONS = ["지인 추천", "SNS", "검색엔진", "뉴스/미디어", "기타"];
const JOIN_REASON_OPTIONS = ["비즈니스 인텔리전스", "시장 분석", "트렌드 파악", "AI 활용 정보", "기타"];

export default function AuthModal({ isOpen, onClose, defaultTab = "login" }: AuthModalProps) {
  const [tab, setTab] = useState<"login" | "signup">(defaultTab);
  const [signupStep, setSignupStep] = useState<1 | 2>(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const [loginEmail, setLoginEmail] = useState("");
  const [loginPassword, setLoginPassword] = useState("");

  const [signupName, setSignupName] = useState("");
  const [signupEmail, setSignupEmail] = useState("");
  const [signupPassword, setSignupPassword] = useState("");
  const [signupConfirm, setSignupConfirm] = useState("");

  const [occupation, setOccupation] = useState("");
  const [occupationOther, setOccupationOther] = useState("");
  const [howFound, setHowFound] = useState("");
  const [howFoundOther, setHowFoundOther] = useState("");
  const [joinReason, setJoinReason] = useState("");
  const [joinReasonOther, setJoinReasonOther] = useState("");

  useEffect(() => {
    setTab(defaultTab);
    setSignupStep(1);
    setError("");
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

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    const result = await signIn("credentials", { email: loginEmail, password: loginPassword, redirect: false });
    setLoading(false);
    if (result?.error) {
      setError("이메일 또는 비밀번호가 올바르지 않습니다.");
    } else {
      onClose();
      window.location.reload();
    }
  };

  const handleStep1 = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    if (signupPassword !== signupConfirm) { setError("비밀번호가 일치하지 않습니다."); return; }
    if (signupPassword.length < 6) { setError("비밀번호는 6자 이상이어야 합니다."); return; }
    setSignupStep(2);
  };

  const getFinalValue = (value: string, other: string) =>
    value === "기타" ? (other.trim() || "기타") : value;

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
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

  return (
    <div
      style={{
        position: "fixed", inset: 0, zIndex: 300, display: "flex",
        alignItems: "center", justifyContent: "center", padding: "20px",
        backgroundColor: "rgba(15, 23, 42, 0.6)", backdropFilter: "blur(4px)",
      }}
      onClick={(e) => e.target === e.currentTarget && onClose()}
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
          <p style={{ fontSize: "20px", fontFamily: "'Pretendard', sans-serif", fontWeight: 700, color: "#0F172A", lineHeight: 1 }}>선익</p>
          <p style={{ fontSize: "11px", fontFamily: "Inter, sans-serif", fontWeight: 600, color: "#94A3B8", letterSpacing: "0.15em", marginTop: "3px" }}>SEONIK</p>
        </div>

        <div style={{ display: "flex", borderBottom: "1px solid #E2E8F0", marginBottom: "28px" }}>
          {(["login", "signup"] as const).map((t) => (
            <button key={t} onClick={() => { setTab(t); setSignupStep(1); setError(""); }}
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

        {error && (
          <p style={{ fontSize: "13px", color: "#EF4444", fontFamily: "'Pretendard', sans-serif", marginBottom: "16px", textAlign: "center" }}>
            {error}
          </p>
        )}

        {/* 로그인 */}
        {tab === "login" && (
          <form onSubmit={handleLogin} style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
            <input type="email" placeholder="이메일" value={loginEmail}
              onChange={(e) => setLoginEmail(e.target.value)} required style={inputStyle} />
            <input type="password" placeholder="비밀번호" value={loginPassword}
              onChange={(e) => setLoginPassword(e.target.value)} required style={inputStyle} />
            <button type="submit" disabled={loading} style={{ ...btnPrimary, marginTop: "4px" }}>
              {loading ? "로그인 중..." : "로그인"}
            </button>
          </form>
        )}

        {/* 회원가입 Step 1 */}
        {tab === "signup" && signupStep === 1 && (
          <form onSubmit={handleStep1} style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
            <p style={{ fontSize: "11px", color: "#94A3B8", fontFamily: "Inter, sans-serif", textAlign: "center", letterSpacing: "0.05em", marginBottom: "4px" }}>
              1 / 2 · 기본 정보
            </p>
            <input type="text" placeholder="이름 (선택)" value={signupName}
              onChange={(e) => setSignupName(e.target.value)} style={inputStyle} />
            <input type="email" placeholder="이메일" value={signupEmail}
              onChange={(e) => setSignupEmail(e.target.value)} required style={inputStyle} />
            <input type="password" placeholder="비밀번호 (6자 이상)" value={signupPassword}
              onChange={(e) => setSignupPassword(e.target.value)} required style={inputStyle} />
            <input type="password" placeholder="비밀번호 확인" value={signupConfirm}
              onChange={(e) => setSignupConfirm(e.target.value)} required style={inputStyle} />
            <button type="submit" style={{ ...btnPrimary, marginTop: "4px" }}>
              다음 →
            </button>
          </form>
        )}

        {/* 회원가입 Step 2 */}
        {tab === "signup" && signupStep === 2 && (
          <form onSubmit={handleSignup} style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
            <p style={{ fontSize: "11px", color: "#94A3B8", fontFamily: "Inter, sans-serif", textAlign: "center", letterSpacing: "0.05em" }}>
              2 / 2 · 추가 정보 (선택)
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
                  {options.map(o => <option key={o} value={o}>{o}</option>)}
                </select>
                {value === "기타" && (
                  <input type="text" placeholder="직접 입력" value={other}
                    onChange={(e) => setOther(e.target.value)} style={inputStyle} />
                )}
              </div>
            ))}

            <div style={{ display: "flex", gap: "8px", marginTop: "4px" }}>
              <button type="button" onClick={() => { setSignupStep(1); setError(""); }}
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

        <p style={{ textAlign: "center", fontSize: "13px", fontFamily: "'Pretendard', sans-serif", color: "#94A3B8", marginTop: "20px" }}>
          {tab === "login" ? (
            <>계정이 없으신가요?{" "}
              <button onClick={() => { setTab("signup"); setSignupStep(1); setError(""); }}
                style={{ background: "none", border: "none", cursor: "pointer", color: "#0F172A", fontWeight: 600, fontSize: "13px", fontFamily: "'Pretendard', sans-serif" }}>
                회원가입
              </button>
            </>
          ) : (
            <>이미 계정이 있으신가요?{" "}
              <button onClick={() => { setTab("login"); setError(""); }}
                style={{ background: "none", border: "none", cursor: "pointer", color: "#0F172A", fontWeight: 600, fontSize: "13px", fontFamily: "'Pretendard', sans-serif" }}>
                로그인
              </button>
            </>
          )}
        </p>
      </div>
    </div>
  );
}

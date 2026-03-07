"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

type Step = "code" | "done";

export default function ResetPasswordPage() {
  const router = useRouter();
  const [step, setStep] = useState<Step>("code");
  const [email, setEmail] = useState("");
  const [code, setCode] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const inputStyle: React.CSSProperties = {
    width: "100%", padding: "12px 14px", border: "1px solid #E2E8F0",
    outline: "none", fontSize: "14px", fontFamily: "'Pretendard', sans-serif",
    color: "#0F172A", backgroundColor: "white", borderRadius: 0, boxSizing: "border-box",
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!email.trim()) { setError("이메일을 입력해 주세요."); return; }
    if (!code.trim() || code.length !== 6) { setError("6자리 코드를 입력해 주세요."); return; }
    if (newPassword.length < 6) { setError("비밀번호는 6자 이상이어야 합니다."); return; }
    if (newPassword !== confirmPassword) { setError("비밀번호가 일치하지 않습니다."); return; }

    setLoading(true);
    try {
      const res = await fetch("/api/auth/reset-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, code, newPassword }),
      });
      const data = await res.json();
      if (!res.ok) { setError(data.error || "재설정에 실패했습니다."); return; }
      setStep("done");
    } catch {
      setError("네트워크 오류가 발생했습니다.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", backgroundColor: "#F8F9FA", padding: "20px" }}>
      <div style={{ backgroundColor: "white", width: "100%", maxWidth: "420px", padding: "48px 40px" }}>

        {/* 로고 */}
        <div style={{ textAlign: "center", marginBottom: "32px" }}>
          <Link href="/" style={{ textDecoration: "none" }}>
            <p style={{ fontSize: "20px", fontFamily: "'Pretendard', sans-serif", fontWeight: 700, color: "#0F172A" }}>선익</p>
            <p style={{ fontSize: "11px", fontFamily: "Inter, sans-serif", fontWeight: 600, color: "#94A3B8", letterSpacing: "0.15em", marginTop: "2px" }}>SEONIK</p>
          </Link>
        </div>

        {step === "code" && (
          <>
            <div style={{ marginBottom: "28px" }}>
              <p style={{ fontSize: "18px", fontFamily: "'Pretendard', sans-serif", fontWeight: 700, color: "#0F172A", marginBottom: "6px" }}>비밀번호 재설정</p>
              <p style={{ fontSize: "13px", fontFamily: "'Pretendard', sans-serif", color: "#94A3B8" }}>이메일로 발송된 6자리 코드를 입력하세요.</p>
            </div>

            {error && (
              <p style={{ fontSize: "13px", color: "#EF4444", fontFamily: "'Pretendard', sans-serif", marginBottom: "16px", textAlign: "center" }}>
                {error}
              </p>
            )}

            <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
              <div>
                <label style={{ fontSize: "12px", color: "#64748B", fontFamily: "'Pretendard', sans-serif", display: "block", marginBottom: "6px" }}>이메일</label>
                <input type="email" placeholder="가입한 이메일 주소" value={email}
                  onChange={(e) => setEmail(e.target.value)} required style={inputStyle} />
              </div>
              <div>
                <label style={{ fontSize: "12px", color: "#64748B", fontFamily: "'Pretendard', sans-serif", display: "block", marginBottom: "6px" }}>인증 코드</label>
                <input
                  type="text" placeholder="6자리 코드" value={code} maxLength={6}
                  onChange={(e) => setCode(e.target.value.replace(/\D/g, "").slice(0, 6))}
                  style={{ ...inputStyle, textAlign: "center", fontSize: "22px", letterSpacing: "0.4em", fontFamily: "monospace" }}
                />
              </div>
              <div>
                <label style={{ fontSize: "12px", color: "#64748B", fontFamily: "'Pretendard', sans-serif", display: "block", marginBottom: "6px" }}>새 비밀번호</label>
                <input type="password" placeholder="새 비밀번호 (6자 이상)" value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)} style={inputStyle} />
              </div>
              <div>
                <label style={{ fontSize: "12px", color: "#64748B", fontFamily: "'Pretendard', sans-serif", display: "block", marginBottom: "6px" }}>새 비밀번호 확인</label>
                <input type="password" placeholder="새 비밀번호 재입력" value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)} style={inputStyle} />
              </div>

              <button type="submit" disabled={loading} style={{
                padding: "13px", backgroundColor: "#0F172A", color: "white",
                border: "none", cursor: loading ? "not-allowed" : "pointer",
                fontSize: "14px", fontFamily: "'Pretendard', sans-serif", fontWeight: 600,
                opacity: loading ? 0.6 : 1, marginTop: "8px", borderRadius: 0,
              }}>
                {loading ? "처리 중..." : "비밀번호 재설정"}
              </button>
            </form>

            <p style={{ textAlign: "center", marginTop: "20px", fontSize: "13px", fontFamily: "'Pretendard', sans-serif", color: "#94A3B8" }}>
              <Link href="/" style={{ color: "#0F172A", fontWeight: 600, textDecoration: "none" }}>← 로그인으로 돌아가기</Link>
            </p>
          </>
        )}

        {step === "done" && (
          <div style={{ textAlign: "center" }}>
            <div style={{ width: "56px", height: "56px", backgroundColor: "#F0FDF4", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 20px", fontSize: "24px" }}>
              ✓
            </div>
            <p style={{ fontSize: "18px", fontFamily: "'Pretendard', sans-serif", fontWeight: 700, color: "#0F172A", marginBottom: "8px" }}>
              비밀번호 재설정 완료
            </p>
            <p style={{ fontSize: "14px", fontFamily: "'Pretendard', sans-serif", color: "#64748B", marginBottom: "32px" }}>
              새 비밀번호로 로그인해 주세요.
            </p>
            <button onClick={() => router.push("/")} style={{
              padding: "13px 32px", backgroundColor: "#0F172A", color: "white",
              border: "none", cursor: "pointer", fontSize: "14px",
              fontFamily: "'Pretendard', sans-serif", fontWeight: 600, borderRadius: 0,
            }}>
              로그인하러 가기
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

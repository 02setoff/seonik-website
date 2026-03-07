"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function ChangePasswordPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [done, setDone] = useState(false);

  // 비로그인 시 홈으로 리다이렉트
  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/");
    }
  }, [status, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    if (newPassword.length < 6) { setError("비밀번호는 6자 이상이어야 합니다."); return; }
    if (newPassword !== confirmPassword) { setError("비밀번호가 일치하지 않습니다."); return; }
    setLoading(true);
    try {
      const res = await fetch("/api/auth/change-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ newPassword, confirmPassword }),
      });
      const data = await res.json();
      if (!res.ok) { setError(data.error || "비밀번호 변경에 실패했습니다."); return; }
      setDone(true);
    } catch {
      setError("네트워크 오류가 발생했습니다.");
    } finally {
      setLoading(false);
    }
  };

  if (status === "loading") return null;
  if (status === "unauthenticated") return null;

  const inputStyle: React.CSSProperties = {
    width: "100%", padding: "12px 14px", border: "1px solid #E2E8F0",
    outline: "none", fontSize: "14px", fontFamily: "'Pretendard', sans-serif",
    color: "#0F172A", backgroundColor: "white", borderRadius: 0, boxSizing: "border-box",
  };

  const mustReset = (session?.user as { mustResetPassword?: boolean })?.mustResetPassword;

  return (
    <div style={{
      minHeight: "100vh", display: "flex", alignItems: "center",
      justifyContent: "center", backgroundColor: "#F8F9FA", padding: "20px",
    }}>
      <div style={{ backgroundColor: "white", width: "100%", maxWidth: "420px", padding: "48px 40px" }}>

        {/* 로고 */}
        <div style={{ textAlign: "center", marginBottom: "32px" }}>
          <Link href="/" style={{ textDecoration: "none" }}>
            <p style={{ fontSize: "20px", fontFamily: "'Pretendard', sans-serif", fontWeight: 700, color: "#0F172A" }}>선익</p>
            <p style={{ fontSize: "11px", fontFamily: "Inter, sans-serif", fontWeight: 600, color: "#94A3B8", letterSpacing: "0.15em", marginTop: "2px" }}>SEONIK</p>
          </Link>
        </div>

        {!done ? (
          <>
            {/* 임시 비밀번호 안내 (mustResetPassword인 경우) */}
            {mustReset && (
              <div style={{
                backgroundColor: "#FFF7ED", border: "1px solid #FED7AA",
                padding: "14px 16px", marginBottom: "24px",
              }}>
                <p style={{ fontSize: "13px", fontFamily: "'Pretendard', sans-serif", color: "#C2410C", fontWeight: 700, marginBottom: "4px" }}>
                  임시 비밀번호로 로그인 중입니다
                </p>
                <p style={{ fontSize: "12px", fontFamily: "'Pretendard', sans-serif", color: "#EA580C", lineHeight: "1.6" }}>
                  보안을 위해 새 비밀번호를 설정해 주세요.
                </p>
              </div>
            )}

            <div style={{ marginBottom: "24px" }}>
              <p style={{ fontSize: "18px", fontFamily: "'Pretendard', sans-serif", fontWeight: 700, color: "#0F172A", marginBottom: "6px" }}>
                새 비밀번호 설정
              </p>
              <p style={{ fontSize: "13px", fontFamily: "'Pretendard', sans-serif", color: "#94A3B8" }}>
                안전한 새 비밀번호를 입력해 주세요.
              </p>
            </div>

            {error && (
              <p style={{ fontSize: "13px", color: "#EF4444", fontFamily: "'Pretendard', sans-serif", marginBottom: "16px", textAlign: "center" }}>
                {error}
              </p>
            )}

            <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
              <div>
                <label style={{ fontSize: "12px", color: "#64748B", fontFamily: "'Pretendard', sans-serif", display: "block", marginBottom: "6px" }}>
                  새 비밀번호
                </label>
                <input
                  type="password" placeholder="새 비밀번호 (6자 이상)" value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)} required style={inputStyle}
                />
              </div>
              <div>
                <label style={{ fontSize: "12px", color: "#64748B", fontFamily: "'Pretendard', sans-serif", display: "block", marginBottom: "6px" }}>
                  새 비밀번호 확인
                </label>
                <input
                  type="password" placeholder="새 비밀번호 재입력" value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)} required style={inputStyle}
                />
              </div>
              <button
                type="submit" disabled={loading}
                style={{
                  padding: "13px", backgroundColor: "#0F172A", color: "white",
                  border: "none", cursor: loading ? "not-allowed" : "pointer",
                  fontSize: "14px", fontFamily: "'Pretendard', sans-serif", fontWeight: 600,
                  opacity: loading ? 0.6 : 1, marginTop: "8px", borderRadius: 0,
                }}
              >
                {loading ? "변경 중..." : "비밀번호 변경"}
              </button>
            </form>

            {!mustReset && (
              <p style={{ textAlign: "center", marginTop: "20px", fontSize: "13px", fontFamily: "'Pretendard', sans-serif", color: "#94A3B8" }}>
                <Link href="/" style={{ color: "#0F172A", fontWeight: 600, textDecoration: "none" }}>← 홈으로 돌아가기</Link>
              </p>
            )}
          </>
        ) : (
          <div style={{ textAlign: "center" }}>
            <div style={{
              width: "56px", height: "56px", backgroundColor: "#F0FDF4", borderRadius: "50%",
              display: "flex", alignItems: "center", justifyContent: "center",
              margin: "0 auto 20px", fontSize: "24px",
            }}>
              ✓
            </div>
            <p style={{ fontSize: "18px", fontFamily: "'Pretendard', sans-serif", fontWeight: 700, color: "#0F172A", marginBottom: "8px" }}>
              비밀번호가 변경되었습니다
            </p>
            <p style={{ fontSize: "14px", fontFamily: "'Pretendard', sans-serif", color: "#64748B", marginBottom: "32px" }}>
              새 비밀번호로 로그인되어 있습니다.
            </p>
            <button
              onClick={() => { window.location.href = "/"; }}
              style={{
                padding: "13px 32px", backgroundColor: "#0F172A", color: "white",
                border: "none", cursor: "pointer", fontSize: "14px",
                fontFamily: "'Pretendard', sans-serif", fontWeight: 600, borderRadius: 0,
              }}
            >
              홈으로 가기
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";

const OCCUPATION_OPTIONS = ["학생", "직장인", "창업가/사업가", "프리랜서", "연구자/학자", "기타"];
const HOW_FOUND_OPTIONS = ["지인 추천", "SNS", "검색엔진", "뉴스/미디어", "기타"];
const JOIN_REASON_OPTIONS = ["비즈니스 인텔리전스", "시장 분석", "트렌드 파악", "AI 활용 정보", "기타"];

export default function EditProfilePage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [form, setForm] = useState({
    name: "", occupation: "", occupationOther: "",
    howFound: "", howFoundOther: "", joinReason: "", joinReasonOther: "",
    email: "",
  });
  const [newsletterConsent, setNewsletterConsent] = useState(false);
  const [newsletterSaving, setNewsletterSaving] = useState(false);
  const [newsletterSuccess, setNewsletterSuccess] = useState(false);
  const [pwForm, setPwForm] = useState({ currentPassword: "", newPassword: "", confirmPassword: "" });
  const [saving, setSaving] = useState(false);
  const [savingPw, setSavingPw] = useState(false);
  const [error, setError] = useState("");
  const [pwError, setPwError] = useState("");
  const [success, setSuccess] = useState(false);
  const [pwSuccess, setPwSuccess] = useState(false);

  useEffect(() => {
    if (status === "unauthenticated") router.push("/");
  }, [status, router]);

  useEffect(() => {
    if (status !== "authenticated") return;
    fetch("/api/user")
      .then(r => r.json())
      .then(data => {
        const occ = data.occupation || "";
        const hf = data.howFound || "";
        const jr = data.joinReason || "";
        setForm({
          name: data.name || "",
          email: data.email || "",
          occupation: OCCUPATION_OPTIONS.includes(occ) ? occ : (occ ? "기타" : ""),
          occupationOther: OCCUPATION_OPTIONS.includes(occ) ? "" : occ,
          howFound: HOW_FOUND_OPTIONS.includes(hf) ? hf : (hf ? "기타" : ""),
          howFoundOther: HOW_FOUND_OPTIONS.includes(hf) ? "" : hf,
          joinReason: JOIN_REASON_OPTIONS.includes(jr) ? jr : (jr ? "기타" : ""),
          joinReasonOther: JOIN_REASON_OPTIONS.includes(jr) ? "" : jr,
        });
        setNewsletterConsent(data.newsletterConsent ?? false);
      })
      .catch(() => {});
  }, [status]);

  const getFinal = (value: string, other: string) =>
    value === "기타" ? (other.trim() || "기타") : value;

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError("");
    setSuccess(false);

    const res = await fetch("/api/user", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: form.name,
        email: form.email,
        occupation: getFinal(form.occupation, form.occupationOther),
        howFound: getFinal(form.howFound, form.howFoundOther),
        joinReason: getFinal(form.joinReason, form.joinReasonOther),
      }),
    });

    const data = await res.json();
    setSaving(false);
    if (!res.ok) {
      setError(data.error || "저장에 실패했습니다.");
    } else {
      setSuccess(true);
      setTimeout(() => router.push("/mypage"), 1200);
    }
  };

  const handleNewsletterSave = async (newValue: boolean) => {
    setNewsletterConsent(newValue);
    setNewsletterSaving(true);
    setNewsletterSuccess(false);
    try {
      await fetch("/api/user", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ newsletterConsent: newValue }),
      });
      setNewsletterSuccess(true);
      setTimeout(() => setNewsletterSuccess(false), 3000);
    } catch {}
    setNewsletterSaving(false);
  };

  const handlePasswordSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setPwError("");
    setPwSuccess(false);
    if (pwForm.newPassword !== pwForm.confirmPassword) {
      setPwError("새 비밀번호가 일치하지 않습니다.");
      return;
    }
    setSavingPw(true);
    const res = await fetch("/api/user", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        currentPassword: pwForm.currentPassword,
        newPassword: pwForm.newPassword,
      }),
    });
    const data = await res.json();
    setSavingPw(false);
    if (!res.ok) {
      setPwError(data.error || "비밀번호 변경에 실패했습니다.");
    } else {
      setPwSuccess(true);
      setPwForm({ currentPassword: "", newPassword: "", confirmPassword: "" });
    }
  };

  if (status === "loading") return null;

  const inputStyle: React.CSSProperties = {
    width: "100%", padding: "10px 14px",
    border: "1px solid var(--input-border)",
    outline: "none", fontSize: "14px", fontFamily: "'Pretendard', sans-serif",
    color: "var(--text-primary)", backgroundColor: "var(--input-bg)",
    borderRadius: 0, boxSizing: "border-box",
  };

  const sectionTitle: React.CSSProperties = {
    fontSize: "16px", fontFamily: "'Pretendard', sans-serif", fontWeight: 700,
    color: "var(--text-primary)", paddingBottom: "12px",
    borderBottom: "1px solid var(--border)", marginBottom: "4px",
  };

  return (
    <div style={{ maxWidth: "560px", margin: "0 auto", padding: "clamp(40px,8vw,64px) clamp(20px,5vw,40px)" }}>
      <div style={{ display: "flex", alignItems: "center", gap: "16px", marginBottom: "40px" }}>
        <Link href="/mypage" style={{ fontSize: "13px", color: "var(--text-placeholder)", fontFamily: "Inter, sans-serif", textDecoration: "none" }}>
          ← 마이페이지
        </Link>
        <h1 style={{ fontSize: "20px", fontFamily: "'Pretendard', sans-serif", fontWeight: 700, color: "var(--text-primary)" }}>
          프로필 수정
        </h1>
      </div>

      {/* 프로필 정보 폼 */}
      <form onSubmit={handleSave} style={{ display: "flex", flexDirection: "column", gap: "20px", marginBottom: "48px" }}>
        <p style={sectionTitle}>기본 정보</p>

        <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
          <label style={{ fontSize: "12px", color: "var(--text-muted)", fontFamily: "'Pretendard', sans-serif", fontWeight: 600 }}>이름</label>
          <input type="text" placeholder="이름" value={form.name}
            onChange={(e) => setForm(f => ({ ...f, name: e.target.value }))}
            style={inputStyle} />
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
          <label style={{ fontSize: "12px", color: "var(--text-muted)", fontFamily: "'Pretendard', sans-serif", fontWeight: 600 }}>이메일 (아이디)</label>
          <input type="email" placeholder="이메일" value={form.email}
            onChange={(e) => setForm(f => ({ ...f, email: e.target.value }))}
            style={inputStyle} />
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
          <label style={{ fontSize: "12px", color: "var(--text-muted)", fontFamily: "'Pretendard', sans-serif", fontWeight: 600 }}>직업</label>
          <select value={form.occupation} onChange={(e) => setForm(f => ({ ...f, occupation: e.target.value }))}
            style={{ ...inputStyle, cursor: "pointer" }}>
            <option value="">선택하세요</option>
            {OCCUPATION_OPTIONS.map(o => <option key={o} value={o}>{o}</option>)}
          </select>
          {form.occupation === "기타" && (
            <input type="text" placeholder="직접 입력" value={form.occupationOther}
              onChange={(e) => setForm(f => ({ ...f, occupationOther: e.target.value }))}
              style={inputStyle} />
          )}
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
          <label style={{ fontSize: "12px", color: "var(--text-muted)", fontFamily: "'Pretendard', sans-serif", fontWeight: 600 }}>선익을 어디서 알게 되셨나요?</label>
          <select value={form.howFound} onChange={(e) => setForm(f => ({ ...f, howFound: e.target.value }))}
            style={{ ...inputStyle, cursor: "pointer" }}>
            <option value="">선택하세요</option>
            {HOW_FOUND_OPTIONS.map(o => <option key={o} value={o}>{o}</option>)}
          </select>
          {form.howFound === "기타" && (
            <input type="text" placeholder="직접 입력" value={form.howFoundOther}
              onChange={(e) => setForm(f => ({ ...f, howFoundOther: e.target.value }))}
              style={inputStyle} />
          )}
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
          <label style={{ fontSize: "12px", color: "var(--text-muted)", fontFamily: "'Pretendard', sans-serif", fontWeight: 600 }}>가입 이유</label>
          <select value={form.joinReason} onChange={(e) => setForm(f => ({ ...f, joinReason: e.target.value }))}
            style={{ ...inputStyle, cursor: "pointer" }}>
            <option value="">선택하세요</option>
            {JOIN_REASON_OPTIONS.map(o => <option key={o} value={o}>{o}</option>)}
          </select>
          {form.joinReason === "기타" && (
            <input type="text" placeholder="직접 입력" value={form.joinReasonOther}
              onChange={(e) => setForm(f => ({ ...f, joinReasonOther: e.target.value }))}
              style={inputStyle} />
          )}
        </div>

        {error && <p style={{ fontSize: "13px", color: "#EF4444", fontFamily: "'Pretendard', sans-serif" }}>{error}</p>}
        {success && <p style={{ fontSize: "13px", color: "#10B981", fontFamily: "'Pretendard', sans-serif" }}>저장되었습니다. 이동 중...</p>}

        <button type="submit" disabled={saving}
          style={{
            padding: "12px", backgroundColor: "#0F172A", color: "white",
            border: "none", cursor: saving ? "not-allowed" : "pointer",
            fontSize: "14px", fontFamily: "'Pretendard', sans-serif", fontWeight: 600,
            opacity: saving ? 0.6 : 1, marginTop: "4px",
          }}>
          {saving ? "저장 중..." : "저장하기"}
        </button>
      </form>

      {/* 이메일 수신 설정 */}
      <div style={{ marginBottom: "48px" }}>
        <p style={sectionTitle}>이메일 알림 설정</p>
        <div style={{ backgroundColor: "var(--bg-card)", border: "1px solid var(--border)", padding: "20px 24px" }}>
          <label style={{ display: "flex", alignItems: "center", justifyContent: "space-between", cursor: "pointer", gap: "16px" }}>
            <div>
              <p style={{ fontSize: "14px", fontFamily: "'Pretendard', sans-serif", fontWeight: 600, color: "var(--text-primary)", marginBottom: "4px" }}>
                새 브리핑 발행 알림
              </p>
              <p style={{ fontSize: "12px", fontFamily: "'Pretendard', sans-serif", color: "var(--text-placeholder)", lineHeight: 1.5 }}>
                새 브리핑이 발행될 때 이메일로 알림을 받습니다.
              </p>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: "10px", flexShrink: 0 }}>
              {newsletterSaving && <span style={{ fontSize: "11px", color: "var(--text-placeholder)", fontFamily: "'Pretendard', sans-serif" }}>저장 중...</span>}
              {newsletterSuccess && <span style={{ fontSize: "11px", color: "#10B981", fontFamily: "'Pretendard', sans-serif" }}>변경됨</span>}
              <button
                type="button"
                onClick={() => handleNewsletterSave(!newsletterConsent)}
                disabled={newsletterSaving}
                style={{
                  width: "44px", height: "24px", borderRadius: "12px", border: "none",
                  backgroundColor: newsletterConsent ? "#0F172A" : "var(--border)",
                  cursor: newsletterSaving ? "not-allowed" : "pointer",
                  position: "relative", transition: "background-color 0.2s", padding: 0,
                }}
              >
                <span style={{
                  position: "absolute", top: "3px",
                  left: newsletterConsent ? "23px" : "3px",
                  width: "18px", height: "18px", borderRadius: "50%",
                  backgroundColor: "white", transition: "left 0.2s",
                  boxShadow: "0 1px 3px rgba(0,0,0,0.2)",
                }} />
              </button>
            </div>
          </label>
          <p style={{ fontSize: "11px", fontFamily: "'Pretendard', sans-serif", color: "var(--text-disabled)", marginTop: "12px", lineHeight: 1.5 }}>
            * 동의 철회 후에도 동의 기록은 정보통신망법 제50조의5에 따라 6개월간 보관됩니다.
          </p>
        </div>
      </div>

      {/* 비밀번호 변경 폼 */}
      <form onSubmit={handlePasswordSave} style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
        <p style={sectionTitle}>비밀번호 변경</p>

        <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
          <label style={{ fontSize: "12px", color: "var(--text-muted)", fontFamily: "'Pretendard', sans-serif", fontWeight: 600 }}>현재 비밀번호</label>
          <input type="password" placeholder="현재 비밀번호" value={pwForm.currentPassword}
            onChange={(e) => setPwForm(f => ({ ...f, currentPassword: e.target.value }))}
            style={inputStyle} />
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
          <label style={{ fontSize: "12px", color: "var(--text-muted)", fontFamily: "'Pretendard', sans-serif", fontWeight: 600 }}>새 비밀번호</label>
          <input type="password" placeholder="새 비밀번호 (6자 이상)" value={pwForm.newPassword}
            onChange={(e) => setPwForm(f => ({ ...f, newPassword: e.target.value }))}
            style={inputStyle} />
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
          <label style={{ fontSize: "12px", color: "var(--text-muted)", fontFamily: "'Pretendard', sans-serif", fontWeight: 600 }}>새 비밀번호 확인</label>
          <input type="password" placeholder="새 비밀번호 재입력" value={pwForm.confirmPassword}
            onChange={(e) => setPwForm(f => ({ ...f, confirmPassword: e.target.value }))}
            style={inputStyle} />
        </div>

        {pwError && <p style={{ fontSize: "13px", color: "#EF4444", fontFamily: "'Pretendard', sans-serif" }}>{pwError}</p>}
        {pwSuccess && <p style={{ fontSize: "13px", color: "#10B981", fontFamily: "'Pretendard', sans-serif" }}>비밀번호가 변경되었습니다.</p>}

        <button type="submit" disabled={savingPw}
          style={{
            padding: "12px", backgroundColor: "#334155", color: "white",
            border: "none", cursor: savingPw ? "not-allowed" : "pointer",
            fontSize: "14px", fontFamily: "'Pretendard', sans-serif", fontWeight: 600,
            opacity: savingPw ? 0.6 : 1, marginTop: "4px",
          }}>
          {savingPw ? "변경 중..." : "비밀번호 변경"}
        </button>
      </form>
    </div>
  );
}

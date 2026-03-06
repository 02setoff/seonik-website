"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";

const OCCUPATION_OPTIONS = ["학생", "직장인", "창업가/사업가", "프리랜서", "연구자/학자", "기타"];
const HOW_FOUND_OPTIONS = ["지인 추천", "SNS", "검색엔진", "뉴스/미디어", "기타"];
const JOIN_REASON_OPTIONS = ["비즈니스 인텔리전스", "시장 분석", "트렌드 파악", "AI 활용 정보", "기타"];

const ALL_OPTIONS = [...OCCUPATION_OPTIONS, ...HOW_FOUND_OPTIONS, ...JOIN_REASON_OPTIONS];

function isPreset(value: string | null, options: string[]) {
  return !value || options.includes(value);
}

export default function EditProfilePage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [form, setForm] = useState({ name: "", occupation: "", occupationOther: "", howFound: "", howFoundOther: "", joinReason: "", joinReasonOther: "" });
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

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
          occupation: OCCUPATION_OPTIONS.includes(occ) ? occ : (occ ? "기타" : ""),
          occupationOther: OCCUPATION_OPTIONS.includes(occ) ? "" : occ,
          howFound: HOW_FOUND_OPTIONS.includes(hf) ? hf : (hf ? "기타" : ""),
          howFoundOther: HOW_FOUND_OPTIONS.includes(hf) ? "" : hf,
          joinReason: JOIN_REASON_OPTIONS.includes(jr) ? jr : (jr ? "기타" : ""),
          joinReasonOther: JOIN_REASON_OPTIONS.includes(jr) ? "" : jr,
        });
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
      setTimeout(() => router.push("/mypage"), 1000);
    }
  };

  if (status === "loading") return null;

  const inputStyle: React.CSSProperties = {
    width: "100%", padding: "10px 14px", border: "1px solid #E2E8F0",
    outline: "none", fontSize: "14px", fontFamily: "'Pretendard', sans-serif",
    color: "#0F172A", backgroundColor: "white", borderRadius: 0, boxSizing: "border-box",
  };

  return (
    <div style={{ maxWidth: "560px", margin: "0 auto", padding: "64px 40px" }}>
      <div style={{ display: "flex", alignItems: "center", gap: "16px", marginBottom: "40px" }}>
        <Link href="/mypage" style={{ fontSize: "13px", color: "#94A3B8", fontFamily: "Inter, sans-serif", textDecoration: "none" }}>
          ← 마이페이지
        </Link>
        <h1 style={{ fontSize: "20px", fontFamily: "'Pretendard', sans-serif", fontWeight: 700, color: "#0F172A" }}>
          프로필 수정
        </h1>
      </div>

      <form onSubmit={handleSave} style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
        {/* 이름 */}
        <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
          <label style={{ fontSize: "12px", color: "#64748B", fontFamily: "'Pretendard', sans-serif", fontWeight: 600 }}>이름</label>
          <input type="text" placeholder="이름" value={form.name}
            onChange={(e) => setForm(f => ({ ...f, name: e.target.value }))}
            style={inputStyle} />
        </div>

        {/* 직업 */}
        <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
          <label style={{ fontSize: "12px", color: "#64748B", fontFamily: "'Pretendard', sans-serif", fontWeight: 600 }}>직업</label>
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

        {/* 어디서 알게 됐는지 */}
        <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
          <label style={{ fontSize: "12px", color: "#64748B", fontFamily: "'Pretendard', sans-serif", fontWeight: 600 }}>선익을 어디서 알게 되셨나요?</label>
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

        {/* 가입 이유 */}
        <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
          <label style={{ fontSize: "12px", color: "#64748B", fontFamily: "'Pretendard', sans-serif", fontWeight: 600 }}>가입 이유</label>
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
    </div>
  );
}

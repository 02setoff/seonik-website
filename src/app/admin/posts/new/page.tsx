"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import RichTextEditor from "@/components/admin/RichTextEditor";

function generateCode(index: number) {
  return `INTEL-${String(index).padStart(3, "0")}`;
}

export default function NewPostPage() {
  const router = useRouter();
  const [form, setForm] = useState({
    code: "", title: "", summary: "", source: "",
    bmBreakdown: "", playbook: "", actionItems: "",
    content: "", category: "RADAR",
    isFree: true, isSubscriberOnly: false, readingTime: "",
    published: false,
  });
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const handleInput = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    if (type === "checkbox") {
      setForm(f => ({ ...f, [name]: (e.target as HTMLInputElement).checked }));
    } else {
      setForm(f => ({ ...f, [name]: value }));
    }
  };

  const handleAutoCode = () => {
    const num = Math.floor(Math.random() * 900) + 100;
    setForm(f => ({ ...f, code: generateCode(num) }));
  };

  const save = async (publish: boolean) => {
    setSaving(true);
    setError("");
    const res = await fetch("/api/admin/posts", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...form, published: publish }),
    });
    setSaving(false);
    if (res.ok) {
      router.push("/admin");
      router.refresh();
    } else {
      const d = await res.json();
      setError(d.error || "저장에 실패했습니다.");
    }
  };

  const inputStyle: React.CSSProperties = {
    width: "100%", padding: "10px 14px", border: "1px solid #E2E8F0",
    outline: "none", fontSize: "14px", fontFamily: "'Pretendard', sans-serif",
    color: "#0F172A", backgroundColor: "white", borderRadius: 0, boxSizing: "border-box",
  };

  const textareaStyle: React.CSSProperties = {
    ...inputStyle, minHeight: "120px", resize: "vertical", lineHeight: "1.7",
  };

  const labelStyle: React.CSSProperties = {
    fontSize: "11px", fontFamily: "Inter, sans-serif", fontWeight: 700,
    letterSpacing: "0.1em", color: "#64748B", marginBottom: "6px", display: "block",
  };

  const sectionStyle: React.CSSProperties = {
    borderTop: "1px solid #E2E8F0", paddingTop: "20px", marginTop: "4px",
  };

  return (
    <div style={{ maxWidth: "860px", margin: "0 auto" }}>
      <div style={{ display: "flex", alignItems: "center", gap: "16px", marginBottom: "28px" }}>
        <Link href="/admin" style={{ fontSize: "13px", color: "#94A3B8", fontFamily: "Inter, sans-serif", textDecoration: "none" }}>
          ← 대시보드
        </Link>
        <h1 style={{ fontSize: "20px", fontFamily: "'Pretendard', sans-serif", fontWeight: 700, color: "#0F172A" }}>
          새 브리핑 작성
        </h1>
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>

        {/* ── 기본 정보 ── */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 140px 120px", gap: "12px", alignItems: "end" }}>
          <div>
            <label style={labelStyle}>제목 *</label>
            <input name="title" placeholder="브리핑 제목" required value={form.title}
              onChange={handleInput} style={{ ...inputStyle, fontSize: "17px", fontWeight: 600 }} />
          </div>
          <div>
            <label style={labelStyle}>카테고리 *</label>
            <select name="category" value={form.category} onChange={handleInput} style={inputStyle}>
              <option value="RADAR">RADAR</option>
              <option value="CORE">CORE</option>
              <option value="FLASH">FLASH</option>
            </select>
          </div>
          <div>
            <label style={labelStyle}>읽는 시간 (분)</label>
            <input name="readingTime" type="number" placeholder="5" value={form.readingTime}
              onChange={handleInput} style={inputStyle} min="1" max="60" />
          </div>
        </div>

        {/* ── 코드명 ── */}
        <div>
          <label style={labelStyle}>코드명 (INTEL-XXX 형식)</label>
          <div style={{ display: "flex", gap: "8px" }}>
            <input name="code" placeholder="예: INTEL-001" value={form.code}
              onChange={handleInput} style={{ ...inputStyle, fontFamily: "Inter, sans-serif", letterSpacing: "0.05em" }} />
            <button type="button" onClick={handleAutoCode}
              style={{
                padding: "10px 16px", backgroundColor: "#F1F5F9", color: "#475569",
                border: "1px solid #E2E8F0", cursor: "pointer", whiteSpace: "nowrap",
                fontSize: "12px", fontFamily: "Inter, sans-serif", fontWeight: 600,
              }}>
              자동 생성
            </button>
          </div>
        </div>

        {/* ── 첩보 소스 ── */}
        <div>
          <label style={labelStyle}>📡 첩보 소스 (데이터 출처)</label>
          <input name="source" placeholder="예: TechCrunch, Hacker News, Medium (최근 7일)" value={form.source}
            onChange={handleInput} style={inputStyle} />
        </div>

        {/* ── 지휘관 요약 ── */}
        <div style={sectionStyle}>
          <label style={labelStyle}>▶ 지휘관 요약 (EXECUTIVE SUMMARY) — 3문장 권장</label>
          <textarea name="summary" placeholder="핵심 내용을 3문장으로 요약해주세요. 피드 카드에도 표시됩니다."
            value={form.summary} onChange={handleInput}
            style={{ ...textareaStyle, minHeight: "90px" }} />
        </div>

        {/* ── BM 심층 해부 ── */}
        <div style={sectionStyle}>
          <label style={labelStyle}>▶ 비즈니스 모델 심층 해부</label>
          <RichTextEditor
            value={form.bmBreakdown}
            onChange={(html) => setForm(f => ({ ...f, bmBreakdown: html }))}
          />
        </div>

        {/* ── 실행 가이드 ── */}
        <div style={sectionStyle}>
          <label style={labelStyle}>▶ 실행 가이드 (Playbook) — 구독자 전용</label>
          <RichTextEditor
            value={form.playbook}
            onChange={(html) => setForm(f => ({ ...f, playbook: html }))}
          />
        </div>

        {/* ── 체크리스트 ── */}
        <div style={sectionStyle}>
          <label style={labelStyle}>▶ 오늘의 체크리스트 — 구독자 전용</label>
          <RichTextEditor
            value={form.actionItems}
            onChange={(html) => setForm(f => ({ ...f, actionItems: html }))}
          />
        </div>

        {/* ── 공개 설정 ── */}
        <div style={{ ...sectionStyle, display: "flex", gap: "32px", alignItems: "center", flexWrap: "wrap" }}>
          <label style={{ display: "flex", alignItems: "center", gap: "8px", cursor: "pointer" }}>
            <input type="checkbox" name="isFree" checked={form.isFree} onChange={handleInput}
              style={{ width: "16px", height: "16px", cursor: "pointer" }} />
            <span style={{ fontSize: "13px", fontFamily: "'Pretendard', sans-serif", color: "#0F172A" }}>
              🔓 무료 공개 (비구독자도 열람 가능)
            </span>
          </label>
          <label style={{ display: "flex", alignItems: "center", gap: "8px", cursor: "pointer" }}>
            <input type="checkbox" name="isSubscriberOnly" checked={form.isSubscriberOnly} onChange={handleInput}
              style={{ width: "16px", height: "16px", cursor: "pointer" }} />
            <span style={{ fontSize: "13px", fontFamily: "'Pretendard', sans-serif", color: "#0F172A" }}>
              🔒 구독 전용 (Playbook·체크리스트 잠금)
            </span>
          </label>
        </div>

        {error && (
          <p style={{ fontSize: "13px", color: "#EF4444", fontFamily: "'Pretendard', sans-serif" }}>{error}</p>
        )}

        <div style={{ display: "flex", gap: "12px", justifyContent: "flex-end", paddingTop: "8px" }}>
          <button onClick={() => save(false)} disabled={saving}
            style={{
              padding: "11px 26px", backgroundColor: "white", color: "#0F172A",
              border: "1px solid #E2E8F0", cursor: saving ? "not-allowed" : "pointer",
              fontSize: "13px", fontFamily: "'Pretendard', sans-serif", fontWeight: 500,
              opacity: saving ? 0.6 : 1,
            }}>
            초안 저장
          </button>
          <button onClick={() => save(true)} disabled={saving}
            style={{
              padding: "11px 26px", backgroundColor: "#0F172A", color: "white",
              border: "none", cursor: saving ? "not-allowed" : "pointer",
              fontSize: "13px", fontFamily: "'Pretendard', sans-serif", fontWeight: 600,
              opacity: saving ? 0.6 : 1,
            }}>
            {saving ? "저장 중..." : "게시하기"}
          </button>
        </div>
      </div>
    </div>
  );
}

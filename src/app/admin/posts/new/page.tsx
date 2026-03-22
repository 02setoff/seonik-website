"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import RichTextEditor from "@/components/admin/RichTextEditor";

const POST_TYPES = [
  { value: "BRIEFING", label: "브리핑 (구조화된 정보 분석)" },
  { value: "NOTICE",   label: "공지사항" },
  { value: "GENERAL",  label: "일반 글" },
];

export default function NewPostPage() {
  const router = useRouter();
  const [form, setForm] = useState({
    postType: "BRIEFING",
    code: "", title: "", summary: "", source: "",
    bmBreakdown: "", playbook: "", actionItems: "",
    deepDive: "", seonikNote: "",
    content: "", category: "",
    isFree: true, isSubscriberOnly: false,
    published: false,
  });
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const handleInput = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    if (type === "checkbox") {
      setForm(f => ({ ...f, [name]: (e.target as HTMLInputElement).checked }));
    } else {
      setForm(f => ({ ...f, [name]: value }));
    }
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
  const labelStyle: React.CSSProperties = {
    fontSize: "11px", fontFamily: "Inter, sans-serif", fontWeight: 700,
    letterSpacing: "0.1em", color: "#64748B", marginBottom: "6px", display: "block",
  };
  const sectionStyle: React.CSSProperties = {
    borderTop: "1px solid #E2E8F0", paddingTop: "20px", marginTop: "4px",
  };
  const isBriefing = form.postType === "BRIEFING";

  return (
    <div style={{ maxWidth: "860px", margin: "0 auto" }}>
      <div style={{ display: "flex", alignItems: "center", gap: "16px", marginBottom: "28px" }}>
        <Link href="/admin" style={{ fontSize: "13px", color: "#94A3B8", fontFamily: "Inter, sans-serif", textDecoration: "none" }}>
          ← 대시보드
        </Link>
        <h1 style={{ fontSize: "20px", fontFamily: "'Pretendard', sans-serif", fontWeight: 700, color: "#0F172A" }}>
          새 글 작성
        </h1>
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>

        {/* ── 글 유형 ── */}
        <div>
          <label style={labelStyle}>글 유형 *</label>
          <select name="postType" value={form.postType} onChange={handleInput}
            style={{ ...inputStyle, cursor: "pointer" }}>
            {POST_TYPES.map(t => (
              <option key={t.value} value={t.value}>{t.label}</option>
            ))}
          </select>
        </div>

        {/* ── 제목 ── */}
        <div>
          <label style={labelStyle}>제목 *</label>
          <input name="title" placeholder="제목을 입력하세요" required value={form.title}
            onChange={handleInput} style={{ ...inputStyle, fontSize: "17px", fontWeight: 600 }} />
        </div>

        {/* ── 브리핑 전용: 코드명 + 소스 ── */}
        {isBriefing && (
          <>
            <div>
              <label style={labelStyle}>코드명 (선택 · INTEL-XXX 형식)</label>
              <input name="code" placeholder="예: INTEL-001" value={form.code}
                onChange={handleInput} style={{ ...inputStyle, fontFamily: "Inter, sans-serif", letterSpacing: "0.05em" }} />
            </div>
            <div>
              <label style={labelStyle}>📡 첩보 소스</label>
              <input name="source" placeholder="예: TechCrunch · Bloomberg · SEONIK Analysis" value={form.source}
                onChange={handleInput} style={inputStyle} />
            </div>
          </>
        )}

        {/* ── 요약 (브리핑: 01단계 / 일반: 한줄 요약) ── */}
        <div style={sectionStyle}>
          <label style={labelStyle}>
            {isBriefing ? "01  브리핑 요약 — 피드에도 표시됩니다" : "한줄 요약 — 피드에 표시됩니다 (선택)"}
          </label>
          <textarea name="summary"
            placeholder={isBriefing ? "핵심 내용을 2~3문장으로 요약해주세요." : "피드에 노출될 짧은 요약 (선택 사항)"}
            value={form.summary} onChange={handleInput}
            style={{ ...inputStyle, minHeight: "90px", resize: "vertical", lineHeight: "1.7" }} />
        </div>

        {/* ── 브리핑 전용 섹션 02~04 ── */}
        {isBriefing && (
          <>
            <div style={sectionStyle}>
              <label style={labelStyle}>02  비즈니스 모델 심층 해부</label>
              <RichTextEditor
                value={form.bmBreakdown}
                onChange={(html) => setForm(f => ({ ...f, bmBreakdown: html }))}
              />
            </div>

            <div style={sectionStyle}>
              <label style={labelStyle}>03  실행 가이드</label>
              <RichTextEditor
                value={form.playbook}
                onChange={(html) => setForm(f => ({ ...f, playbook: html }))}
              />
            </div>

            <div style={sectionStyle}>
              <label style={labelStyle}>04  체크리스트</label>
              <RichTextEditor
                value={form.actionItems}
                onChange={(html) => setForm(f => ({ ...f, actionItems: html }))}
              />
            </div>

            {/* 구독자 전용 섹션 */}
            <div style={{ ...sectionStyle, borderTop: "2px dashed #E2E8F0" }}>
              <p style={{
                fontSize: "11px", fontFamily: "Inter, sans-serif", fontWeight: 700,
                letterSpacing: "0.12em", color: "#94A3B8", marginBottom: "20px",
              }}>🔒 구독자 전용 섹션 (05~06)</p>

              <div style={{ marginBottom: "20px" }}>
                <label style={labelStyle}>05  심층 분석 — 구독자 전용</label>
                <RichTextEditor
                  value={form.deepDive}
                  onChange={(html) => setForm(f => ({ ...f, deepDive: html }))}
                />
              </div>

              <div>
                <label style={labelStyle}>06  선익 코멘트 — 구독자 전용</label>
                <RichTextEditor
                  value={form.seonikNote}
                  onChange={(html) => setForm(f => ({ ...f, seonikNote: html }))}
                />
              </div>
            </div>
          </>
        )}

        {/* ── 일반/공지 본문 ── */}
        {!isBriefing && (
          <div style={sectionStyle}>
            <label style={labelStyle}>본문</label>
            <RichTextEditor
              value={form.content}
              onChange={(html) => setForm(f => ({ ...f, content: html }))}
            />
          </div>
        )}

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

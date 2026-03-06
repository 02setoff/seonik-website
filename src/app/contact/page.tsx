"use client";

import { useState } from "react";
import Link from "next/link";

export default function ContactPage() {
  const [form, setForm] = useState({ name: "", email: "", subject: "", message: "" });
  const [status, setStatus] = useState<"idle" | "sending" | "done" | "error">("idle");

  const handle = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
    setForm(f => ({ ...f, [e.target.name]: e.target.value }));

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus("sending");
    const res = await fetch("/api/contact", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });
    setStatus(res.ok ? "done" : "error");
  };

  const inputStyle: React.CSSProperties = {
    width: "100%",
    padding: "12px 16px",
    border: "1px solid #E2E8F0",
    outline: "none",
    fontSize: "14px",
    fontFamily: "'Pretendard', sans-serif",
    color: "#0F172A",
    backgroundColor: "#F8FAFC",
    borderRadius: 0,
    boxSizing: "border-box",
  };

  return (
    <div className="bg-[#F8F9FA] min-h-screen">
      <div className="mx-auto" style={{ maxWidth: "640px", padding: "64px 40px" }}>
        <Link href="/" className="text-[#94A3B8] hover:text-[#0F172A] transition-colors duration-150"
          style={{ fontSize: "13px", fontFamily: "Inter, sans-serif" }}>
          ← 홈으로
        </Link>

        <h1 className="font-bold text-[#0F172A]"
          style={{ fontSize: "28px", fontFamily: "'Pretendard', sans-serif", marginTop: "24px", marginBottom: "8px" }}>
          문의하기
        </h1>
        <p className="text-[#64748B]"
          style={{ fontSize: "14px", fontFamily: "'Pretendard', sans-serif", marginBottom: "40px" }}>
          궁금한 점이나 협업 제안을 자유롭게 보내주세요.
        </p>

        {status === "done" ? (
          <div className="bg-white border border-[#E2E8F0] p-8 text-center">
            <p className="text-[#0F172A] font-semibold"
              style={{ fontSize: "18px", fontFamily: "'Pretendard', sans-serif", marginBottom: "8px" }}>
              문의가 접수되었습니다.
            </p>
            <p className="text-[#64748B]"
              style={{ fontSize: "14px", fontFamily: "'Pretendard', sans-serif" }}>
              빠른 시일 내에 답변 드리겠습니다.
            </p>
          </div>
        ) : (
          <form onSubmit={submit} style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px" }}>
              <input name="name" placeholder="이름" required value={form.name} onChange={handle} style={inputStyle} />
              <input name="email" type="email" placeholder="이메일" required value={form.email} onChange={handle} style={inputStyle} />
            </div>
            <input name="subject" placeholder="제목" required value={form.subject} onChange={handle} style={inputStyle} />
            <textarea
              name="message"
              placeholder="내용을 입력해주세요."
              required
              value={form.message}
              onChange={handle}
              rows={8}
              style={{ ...inputStyle, resize: "vertical" }}
            />
            {status === "error" && (
              <p style={{ fontSize: "13px", fontFamily: "'Pretendard', sans-serif", color: "#EF4444" }}>
                오류가 발생했습니다. 다시 시도해주세요.
              </p>
            )}
            <button
              type="submit"
              disabled={status === "sending"}
              style={{
                padding: "14px",
                backgroundColor: "#0F172A",
                color: "white",
                border: "none",
                cursor: status === "sending" ? "not-allowed" : "pointer",
                fontSize: "14px",
                fontFamily: "'Pretendard', sans-serif",
                fontWeight: 600,
                opacity: status === "sending" ? 0.6 : 1,
                borderRadius: 0,
              }}
            >
              {status === "sending" ? "전송 중..." : "문의 보내기"}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}

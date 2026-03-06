"use client";

import { useState, useEffect } from "react";
import { X } from "lucide-react";

interface ContactModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function ContactModal({ isOpen, onClose }: ContactModalProps) {
  const [form, setForm] = useState({ name: "", email: "", subject: "", message: "" });
  const [status, setStatus] = useState<"idle" | "sending" | "sent" | "error">("idle");

  useEffect(() => {
    if (!isOpen) {
      setForm({ name: "", email: "", subject: "", message: "" });
      setStatus("idle");
    }
  }, [isOpen]);

  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); };
    if (isOpen) window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [isOpen, onClose]);

  useEffect(() => {
    document.body.style.overflow = isOpen ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [isOpen]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus("sending");
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      if (res.ok) setStatus("sent");
      else setStatus("error");
    } catch {
      setStatus("error");
    }
  };

  if (!isOpen) return null;

  return (
    <div
      style={{
        position: "fixed", inset: 0, zIndex: 300,
        display: "flex", alignItems: "center", justifyContent: "center",
        padding: "20px",
        backgroundColor: "rgba(15, 23, 42, 0.75)", backdropFilter: "blur(4px)",
      }}
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div style={{
        backgroundColor: "#ffffff", width: "100%", maxWidth: "500px",
        padding: "40px", position: "relative",
      }}>
        <button
          onClick={onClose}
          style={{ position: "absolute", top: "20px", right: "20px" }}
          className="text-[#94A3B8] hover:text-[#0F172A] transition-colors duration-200"
        >
          <X size={20} />
        </button>

        {status === "sent" ? (
          <div className="flex flex-col items-center justify-center py-10 text-center">
            <p className="font-bold text-[#0F172A] mb-3"
              style={{ fontSize: "20px", fontFamily: "'Pretendard', sans-serif" }}>
              문의가 접수되었습니다.
            </p>
            <p className="text-[#64748B]"
              style={{ fontSize: "14px", fontFamily: "'Pretendard', sans-serif" }}>
              빠르게 답변 드리겠습니다.
            </p>
          </div>
        ) : (
          <>
            <h2 className="font-bold text-[#0F172A] mb-1"
              style={{ fontSize: "20px", fontFamily: "'Pretendard', sans-serif" }}>
              문의하기
            </h2>
            <p className="text-[#94A3B8] mb-8"
              style={{ fontSize: "12px", fontFamily: "Inter, sans-serif", letterSpacing: "0.03em" }}>
              seonik.official@gmail.com
            </p>

            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
              <div className="grid grid-cols-2 gap-3">
                <div className="flex flex-col gap-1.5">
                  <label style={{ fontSize: "11px", fontFamily: "'Pretendard', sans-serif", color: "#64748B" }}>이름</label>
                  <input
                    required
                    value={form.name}
                    onChange={(e) => setForm(p => ({ ...p, name: e.target.value }))}
                    className="border border-[#E2E8F0] px-3 py-2.5 text-[#0F172A] outline-none focus:border-[#0F172A] transition-colors duration-150"
                    style={{ fontSize: "14px", fontFamily: "'Pretendard', sans-serif" }}
                    placeholder="홍길동"
                  />
                </div>
                <div className="flex flex-col gap-1.5">
                  <label style={{ fontSize: "11px", fontFamily: "'Pretendard', sans-serif", color: "#64748B" }}>이메일</label>
                  <input
                    required
                    type="email"
                    value={form.email}
                    onChange={(e) => setForm(p => ({ ...p, email: e.target.value }))}
                    className="border border-[#E2E8F0] px-3 py-2.5 text-[#0F172A] outline-none focus:border-[#0F172A] transition-colors duration-150"
                    style={{ fontSize: "14px", fontFamily: "'Pretendard', sans-serif" }}
                    placeholder="you@example.com"
                  />
                </div>
              </div>

              <div className="flex flex-col gap-1.5">
                <label style={{ fontSize: "11px", fontFamily: "'Pretendard', sans-serif", color: "#64748B" }}>제목</label>
                <input
                  required
                  value={form.subject}
                  onChange={(e) => setForm(p => ({ ...p, subject: e.target.value }))}
                  className="border border-[#E2E8F0] px-3 py-2.5 text-[#0F172A] outline-none focus:border-[#0F172A] transition-colors duration-150"
                  style={{ fontSize: "14px", fontFamily: "'Pretendard', sans-serif" }}
                  placeholder="문의 제목을 입력하세요"
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <label style={{ fontSize: "11px", fontFamily: "'Pretendard', sans-serif", color: "#64748B" }}>내용</label>
                <textarea
                  required
                  rows={5}
                  value={form.message}
                  onChange={(e) => setForm(p => ({ ...p, message: e.target.value }))}
                  className="border border-[#E2E8F0] px-3 py-2.5 text-[#0F172A] outline-none focus:border-[#0F172A] transition-colors duration-150 resize-none"
                  style={{ fontSize: "14px", fontFamily: "'Pretendard', sans-serif" }}
                  placeholder="문의 내용을 자유롭게 작성해주세요"
                />
              </div>

              {status === "error" && (
                <p className="text-red-500" style={{ fontSize: "13px", fontFamily: "'Pretendard', sans-serif" }}>
                  전송에 실패했습니다. 다시 시도해주세요.
                </p>
              )}

              <button
                type="submit"
                disabled={status === "sending"}
                className="bg-[#0F172A] text-white font-medium hover:opacity-90 transition-opacity duration-200 disabled:opacity-50"
                style={{ padding: "13px", fontSize: "14px", fontFamily: "'Pretendard', sans-serif" }}
              >
                {status === "sending" ? "전송 중..." : "문의 보내기"}
              </button>
            </form>
          </>
        )}
      </div>
    </div>
  );
}

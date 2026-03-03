"use client";

import { useState } from "react";
import { Mail, Instagram, Send, CheckCircle } from "lucide-react";

export default function ContactPage() {
  const [formState, setFormState] = useState({
    name: "",
    email: "",
    message: "",
  });
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: 실제 폼 제출 로직 연동 (예: API route, 이메일 서비스)
    setSubmitted(true);
  };

  return (
    <div className="page-transition">
      {/* Hero */}
      <section className="pt-32 lg:pt-40 pb-12 lg:pb-16 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <p className="text-xs tracking-[0.3em] uppercase text-slate-400 mb-6">
            Contact
          </p>
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-midnight-slate mb-6 leading-tight text-balance">
            문의하기
          </h1>
          <p className="text-base md:text-lg text-slate-600 max-w-2xl mx-auto leading-relaxed">
            선익과 함께 정보의 힘을 경험하세요.
          </p>
        </div>
      </section>

      {/* Contact Info + Form */}
      <section className="pb-24 lg:pb-32 px-6">
        <div className="max-w-4xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 lg:gap-16">
            {/* Contact Info */}
            <div>
              <h2 className="text-lg font-semibold text-midnight-slate mb-8">
                연락처
              </h2>
              <div className="space-y-6">
                <a
                  href="mailto:contact@seonik.kr"
                  className="flex items-center gap-4 group"
                >
                  <div className="w-10 h-10 border border-slate-200 flex items-center justify-center group-hover:border-midnight-slate/30 transition-colors duration-200">
                    <Mail size={16} className="text-midnight-slate" />
                  </div>
                  <div>
                    <p className="text-xs text-slate-400 mb-1">이메일</p>
                    <p className="text-sm text-midnight-slate group-hover:text-accent-gold transition-colors duration-200">
                      contact@seonik.kr
                    </p>
                  </div>
                </a>

                <a
                  href="https://instagram.com/seonik_official"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-4 group"
                >
                  <div className="w-10 h-10 border border-slate-200 flex items-center justify-center group-hover:border-midnight-slate/30 transition-colors duration-200">
                    <Instagram size={16} className="text-midnight-slate" />
                  </div>
                  <div>
                    <p className="text-xs text-slate-400 mb-1">인스타그램</p>
                    <p className="text-sm text-midnight-slate group-hover:text-accent-gold transition-colors duration-200">
                      @seonik_official
                    </p>
                  </div>
                </a>
              </div>
            </div>

            {/* Contact Form */}
            <div>
              <h2 className="text-lg font-semibold text-midnight-slate mb-8">
                문의 양식
              </h2>

              {submitted ? (
                <div className="border border-slate-200 p-8 text-center">
                  <CheckCircle
                    size={32}
                    strokeWidth={1.5}
                    className="text-midnight-slate mx-auto mb-4"
                  />
                  <p className="text-base font-medium text-midnight-slate mb-2">
                    문의가 접수되었습니다.
                  </p>
                  <p className="text-sm text-slate-600">
                    빠른 시일 내에 답변 드리겠습니다.
                  </p>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div>
                    <label
                      htmlFor="name"
                      className="block text-xs text-slate-400 mb-2 tracking-wide"
                    >
                      이름
                    </label>
                    <input
                      type="text"
                      id="name"
                      required
                      value={formState.name}
                      onChange={(e) =>
                        setFormState({ ...formState, name: e.target.value })
                      }
                      className="w-full px-4 py-3 bg-paper-white border border-slate-200 text-sm text-midnight-slate placeholder:text-slate-400 focus:outline-none focus:border-midnight-slate transition-colors duration-200"
                      placeholder="홍길동"
                    />
                  </div>

                  <div>
                    <label
                      htmlFor="email"
                      className="block text-xs text-slate-400 mb-2 tracking-wide"
                    >
                      이메일
                    </label>
                    <input
                      type="email"
                      id="email"
                      required
                      value={formState.email}
                      onChange={(e) =>
                        setFormState({ ...formState, email: e.target.value })
                      }
                      className="w-full px-4 py-3 bg-paper-white border border-slate-200 text-sm text-midnight-slate placeholder:text-slate-400 focus:outline-none focus:border-midnight-slate transition-colors duration-200"
                      placeholder="example@email.com"
                    />
                  </div>

                  <div>
                    <label
                      htmlFor="message"
                      className="block text-xs text-slate-400 mb-2 tracking-wide"
                    >
                      문의 내용
                    </label>
                    <textarea
                      id="message"
                      required
                      rows={5}
                      value={formState.message}
                      onChange={(e) =>
                        setFormState({ ...formState, message: e.target.value })
                      }
                      className="w-full px-4 py-3 bg-paper-white border border-slate-200 text-sm text-midnight-slate placeholder:text-slate-400 focus:outline-none focus:border-midnight-slate transition-colors duration-200 resize-none"
                      placeholder="문의하실 내용을 입력해주세요."
                    />
                  </div>

                  <button
                    type="submit"
                    className="inline-flex items-center gap-2 px-8 py-4 bg-midnight-slate text-paper-white text-sm font-medium tracking-wide hover:bg-midnight-slate/90 transition-all duration-200 w-full justify-center"
                  >
                    <Send size={14} />
                    전송하기
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

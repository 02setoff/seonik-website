import Link from "next/link";
import Logo from "./Logo";

export default function Footer() {
  return (
    <footer className="bg-midnight-slate text-pure-white">
      <div className="max-w-6xl mx-auto px-6 lg:px-8 py-16 lg:py-20">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 lg:gap-16">
          {/* Brand */}
          <div className="md:col-span-1">
            <div className="flex items-center gap-3 mb-6">
              <div className="relative w-7 h-7 flex items-center justify-center">
                <svg
                  width="24"
                  height="24"
                  viewBox="0 0 28 28"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M7 21L21 7M21 7H9M21 7V19"
                    stroke="#F8F9FA"
                    strokeWidth="2.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </div>
              <div className="flex flex-col leading-none">
                <span className="text-base font-bold tracking-wider text-paper-white">
                  SEONIK
                </span>
                <span className="text-[9px] tracking-[0.2em] text-slate-400 mt-0.5">
                  선익
                </span>
              </div>
            </div>
            <p className="text-sm text-slate-400 leading-relaxed max-w-xs">
              먼저 아는 자가 이긴다.
              <br />
              AI 네이티브 프라이빗 싱크탱크.
            </p>
          </div>

          {/* Navigation */}
          <div>
            <h3 className="text-xs font-medium tracking-widest uppercase text-slate-400 mb-6">
              페이지
            </h3>
            <ul className="space-y-3">
              {[
                { name: "홈", href: "/" },
                { name: "소개", href: "/about" },
                { name: "서비스", href: "/services" },
                { name: "문의", href: "/contact" },
              ].map((item) => (
                <li key={item.name}>
                  <Link
                    href={item.href}
                    className="text-sm text-slate-400 hover:text-pure-white transition-colors duration-200"
                  >
                    {item.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="text-xs font-medium tracking-widest uppercase text-slate-400 mb-6">
              연락처
            </h3>
            <ul className="space-y-3">
              <li>
                <a
                  href="mailto:contact@seonik.kr"
                  className="text-sm text-slate-400 hover:text-pure-white transition-colors duration-200"
                >
                  contact@seonik.kr
                </a>
              </li>
              <li>
                <a
                  href="https://instagram.com/seonik_official"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm text-slate-400 hover:text-pure-white transition-colors duration-200"
                >
                  @seonik_official
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-16 pt-8 border-t border-white/10">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-xs text-slate-400">
              &copy; {new Date().getFullYear()} SEONIK 선익. All rights reserved.
            </p>
            <p className="text-xs text-slate-400">
              先益 &mdash; Know First, Win First.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}

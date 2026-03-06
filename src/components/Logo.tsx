import Link from "next/link";

export default function Logo({ className = "" }: { className?: string }) {
  return (
    <Link href="/" className={`flex items-center gap-3 group ${className}`}>
      {/* Arrow Symbol */}
      <div className="relative w-8 h-8 flex items-center justify-center">
        <svg
          width="28"
          height="28"
          viewBox="0 0 28 28"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
        >
          <path
            d="M7 21L21 7M21 7H9M21 7V19"
            stroke="#0F172A"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </div>
      {/* Wordmark */}
      <span className="text-lg font-bold tracking-wider text-midnight-slate font-display">
        선익 SEONIK
      </span>
    </Link>
  );
}

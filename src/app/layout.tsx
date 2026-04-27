import type { Metadata } from "next";
import "./globals.css";
import SeonikHeader from "@/components/SeonikHeader";
import SeonikFooter from "@/components/SeonikFooter";

export const metadata: Metadata = {
  title: "선익 SEONIK — 창업 공고 피드",
  description: "K-스타트업, 기업마당 최신 창업 지원 공고를 한눈에. 지역·단계별 필터로 내게 맞는 공고만 빠르게.",
  keywords: ["창업 공고", "스타트업 지원", "K-스타트업", "기업마당", "선익", "SEONIK"],
  metadataBase: new URL("https://seonik.kr"),
  alternates: { canonical: "/" },
  openGraph: {
    title: "선익 SEONIK — 창업 공고 피드",
    description: "K-스타트업, 기업마당 최신 창업 지원 공고를 한눈에.",
    url: "https://seonik.kr",
    type: "website",
    locale: "ko_KR",
    siteName: "선익 SEONIK",
  },
  twitter: {
    card: "summary",
    title: "선익 SEONIK — 창업 공고 피드",
    description: "K-스타트업, 기업마당 최신 창업 지원 공고를 한눈에.",
  },
  robots: { index: true, follow: true },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ko">
      <body className="antialiased">
        <SeonikHeader />
        <main style={{ minHeight: "calc(100vh - 120px)" }}>
          {children}
        </main>
        <SeonikFooter />
      </body>
    </html>
  );
}

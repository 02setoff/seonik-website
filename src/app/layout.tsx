import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

export const metadata: Metadata = {
  title: "선익 SEONIK | 먼저 아는 자가 이긴다",
  description:
    "AI 네이티브 프라이빗 싱크탱크. 대기업만 누리던 비즈니스 인텔리전스를 1인 사업자와 소규모 창업자에게 제공합니다.",
  keywords: [
    "선익",
    "SEONIK",
    "비즈니스 인텔리전스",
    "AI 분석",
    "시장 분석",
    "창업",
    "컨설팅",
    "싱크탱크",
  ],
  openGraph: {
    title: "선익 SEONIK | 먼저 아는 자가 이긴다",
    description:
      "AI 네이티브 프라이빗 싱크탱크. 대기업만 누리던 비즈니스 인텔리전스를 당신의 사업에도.",
    type: "website",
    locale: "ko_KR",
    siteName: "SEONIK 선익",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko">
      <body className={`${inter.variable} antialiased`}>
        <Header />
        <main className="min-h-screen">{children}</main>
        <Footer />
      </body>
    </html>
  );
}

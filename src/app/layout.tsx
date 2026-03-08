import type { Metadata } from "next";
import "./globals.css";
import LayoutWrapper from "@/components/LayoutWrapper";
import SessionProvider from "@/components/SessionProvider";
import { ThemeProvider } from "@/components/ThemeProvider";

export const metadata: Metadata = {
  title: "선익 SEONIK",
  description:
    "AI 네이티브 프라이빗 싱크탱크. 앞서나가는 정보로 실행가들을 이롭게.",
  keywords: [
    "선익",
    "SEONIK",
    "비즈니스 인텔리전스",
    "AI 분석",
    "시장 분석",
    "창업",
    "싱크탱크",
  ],
  metadataBase: new URL("https://seonik.kr"),
  alternates: {
    canonical: "/",
  },
  openGraph: {
    title: "선익 SEONIK",
    description:
      "AI 네이티브 프라이빗 싱크탱크. 앞서나가는 정보로 실행가들을 이롭게.",
    url: "https://seonik.kr",
    type: "website",
    locale: "ko_KR",
    siteName: "선익 SEONIK",
  },
  twitter: {
    card: "summary",
    title: "선익 SEONIK",
    description:
      "AI 네이티브 프라이빗 싱크탱크. 앞서나가는 정보로 실행가들을 이롭게.",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
    },
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko" suppressHydrationWarning>
      <body className="antialiased">
        <SessionProvider>
          <ThemeProvider>
            <LayoutWrapper>{children}</LayoutWrapper>
          </ThemeProvider>
        </SessionProvider>
      </body>
    </html>
  );
}

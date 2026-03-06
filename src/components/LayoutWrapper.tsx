"use client";

import { usePathname } from "next/navigation";
import FeedHeader from "@/components/layout/Header";
import FeedFooter from "@/components/layout/Footer";

export default function LayoutWrapper({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const isHome = pathname === "/";
  const isAdmin = pathname.startsWith("/admin");
  const showLayout = !isHome && !isAdmin;

  return (
    <>
      {showLayout && <FeedHeader />}
      <main className={showLayout ? "min-h-screen bg-[#F8F9FA]" : ""}>{children}</main>
      {showLayout && <FeedFooter />}
    </>
  );
}

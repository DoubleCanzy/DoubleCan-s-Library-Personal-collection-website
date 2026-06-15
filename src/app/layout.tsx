import type { Metadata } from "next";
import NavBar from "@/components/layout/NavBar";
import "./globals.css";

export const metadata: Metadata = {
  title: "DoubleCan's Library",
  description: "A personal library of novels, anime, and manga",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="zh-CN"
      className="h-full antialiased"
    >
      <body className="min-h-full flex flex-col bg-white text-black font-sans">
        <NavBar />
        <main className="flex-1">{children}</main>
      </body>
    </html>
  );
}

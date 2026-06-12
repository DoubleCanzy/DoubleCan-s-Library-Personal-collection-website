"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

export default function NavBar() {
  const pathname = usePathname();

  const links = [
    { href: "/", label: "Home" },
    { href: "/feed", label: "Feed" },
    { href: "/library", label: "Library" },
  ];

  return (
    <header className="sticky top-0 z-40 bg-white border-b border-black">
      <div className="mx-auto flex h-14 max-w-7xl items-center justify-between px-6">
        {/* 网站名称 */}
        <Link
          href="/"
          className="text-lg font-semibold tracking-tight hover:opacity-70 transition-opacity"
        >
          DoubleCan&apos;s Library
        </Link>

        {/* 导航链接 */}
        <nav className="flex items-center gap-1">
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={cn(
                "px-3 py-1.5 text-sm font-medium transition-colors",
                pathname === link.href
                  ? "bg-black text-white"
                  : "text-gray-600 hover:text-black hover:bg-gray-100"
              )}
            >
              {link.label}
            </Link>
          ))}
          {/* 添加作品按钮 */}
          <Link
            href="/works/new"
            className={cn(
              "ml-3 px-4 py-1.5 text-sm font-medium border border-black transition-colors",
              pathname === "/works/new"
                ? "bg-black text-white"
                : "text-black hover:bg-black hover:text-white"
            )}
          >
            + Add Work
          </Link>
        </nav>
      </div>
    </header>
  );
}

"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Button } from "@/components/ui/button";
import { H3 } from "@/components/ui/typography";
import Image from "next/image";
import { Globe } from "lucide-react";
import { cn } from "@/lib/utils/utils";

export function Header() {
  const pathname = usePathname();

  const navItems = [
    { href: "/search", label: "Tìm vé" },
    { href: "/schedule", label: "Lịch trình" },
    { href: "/promotions", label: "Ưu đãi" },
    { href: "/support", label: "Hỗ trợ" },
    { href: "/my-tickets", label: "Vé của tôi" },
  ];

  return (
    <header className="sticky top-0 z-50 w-full border-b border-[#E5E6EB] bg-[#F5F6FA]">
      <div className="mx-auto flex h-20 max-w-[1440px] items-center justify-between px-12">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2 hover:opacity-90 transition-opacity">
          <Image
            src="/image/1213-Photoroom.png"
            alt="TrainBook Logo"
            width={150}
            height={36}
            className="object-contain"
          />
        </Link>

        {/* Navigation */}
        <nav className="hidden md:flex items-center gap-8">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "relative text-sm font-medium transition-colors duration-200 after:absolute after:left-0 after:-bottom-[4px] after:h-[2px] after:w-0 after:bg-[#6396f5] after:transition-all after:duration-300 hover:after:w-full",
                pathname === item.href
                  ? "text-[#1A1F2C] after:w-full"
                  : "text-[#1A1F2C] hover:text-[#1A1F2C]"
              )}
            >
              {item.label}
            </Link>
          ))}
        </nav>


        {/* Actions */}
        <div className="flex items-center gap-4">
          {/* Auth buttons */}
          <div className="flex items-center gap-2">
            <Link href="/login">
              <Button
                variant="ghost"
                size="sm"
                className="text-[#1A1F2C] hover:bg-[#E9EAEC] font-medium"
              >
                Đăng nhập
              </Button>
            </Link>
            <Link href="/register">
              <Button
                size="sm"
                className="bg-[#6396f5] text-white hover:bg-[#5288ef] font-medium"
              >
                Đăng ký
              </Button>
            </Link>
          </div>

          {/* Language icon */}
          <button
            aria-label="language"
            className="p-2 hover:opacity-80 transition-opacity"
          >
            <Globe className="h-5 w-5 text-[#1A1F2C]" />
          </button>
        </div>
      </div>
    </header>
  );
}

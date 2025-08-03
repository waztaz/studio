"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, BedDouble, BookOpen, User, MoreHorizontal, Sun, Wind, ShoppingBag, Info } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "../ui/button";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "../ui/sheet";

const navItems = [
  { href: "/", label: "홈", icon: Home },
  { href: "/custom", label: "맞춤寝具", icon: BedDouble },
  { href: "/sleep-read", label: "수면지식", icon: BookOpen },
  { href: "/login", label: "로그인", icon: User },
];

const moreLinks = [
  { href: "#", label: "계절별 추천", icon: Sun },
  { href: "#", label: "기간 한정 특가", icon: ShoppingBag },
  { href: "/custom", label: "맞춤 침구 찾기", icon: BedDouble },
  { href: "/sleep-read", label: "침구 지식 센터", icon: BookOpen },
];

export default function BottomNav() {
  const pathname = usePathname();

  return (
    <div className="md:hidden fixed bottom-0 left-0 right-0 h-16 bg-background border-t z-50 shadow-t">
      <div className="grid h-full grid-cols-5">
        {navItems.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className={cn(
              "flex flex-col items-center justify-center gap-1 text-xs transition-colors",
              pathname === item.href ? "text-primary" : "text-muted-foreground hover:text-foreground"
            )}
          >
            <item.icon className="h-5 w-5" />
            <span>{item.label}</span>
          </Link>
        ))}
        <Sheet>
          <SheetTrigger asChild>
            <button
              className="flex flex-col items-center justify-center gap-1 text-xs text-muted-foreground hover:text-foreground transition-colors"
              aria-label="더보기"
            >
              <MoreHorizontal className="h-5 w-5" />
              <span>더보기</span>
            </button>
          </SheetTrigger>
          <SheetContent side="bottom" className="rounded-t-lg">
            <SheetHeader className="mb-4">
              <SheetTitle>더보기</SheetTitle>
            </SheetHeader>
            <div className="grid grid-cols-2 gap-4">
              {moreLinks.map((link) => (
                <Link
                  key={link.label}
                  href={link.href}
                  className="flex items-center gap-3 rounded-lg p-3 bg-secondary hover:bg-muted"
                >
                  <link.icon className="h-6 w-6 text-primary" />
                  <span className="font-medium">{link.label}</span>
                </Link>
              ))}
            </div>
          </SheetContent>
        </Sheet>
      </div>
    </div>
  );
}

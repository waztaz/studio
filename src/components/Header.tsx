
"use client";

import { useAuth } from "@/components/AuthContext";
import { Button } from "@/components/ui/button";
import { LogOut, UserCircle, Feather, LogIn } from "lucide-react";
import Link from 'next/link';
import { Skeleton } from "./ui/skeleton";

export default function Header() {
  const { user, isLoggedIn, role, logout, isLoading, isGuest } = useAuth();

  const sessionActive = isLoggedIn || isGuest;

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto flex h-16 items-center justify-between">
        <Link href="/" className="flex items-center gap-2 text-xl font-bold hover:opacity-80 transition-opacity">
          <Feather className="text-primary" />
          waztaz
        </Link>
        
        {isLoading ? (
          <Skeleton className="h-9 w-36 rounded-md" />
        ) : (
          sessionActive ? (
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2 border-r pr-4 mr-2">
                <UserCircle size={20} className="text-muted-foreground" />
                <span className="text-sm text-muted-foreground">
                  {isGuest ? 'Guest' : (user?.displayName || 'User')}
                </span>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={logout}
              >
                <LogOut size={16} className="mr-2" />
                Logout
              </Button>
            </div>
          ) : (
             <Button asChild variant="outline" size="sm">
                <Link href="/login">
                  <LogIn size={16} className="mr-2" />
                  Sign In
                </Link>
              </Button>
          )
        )}
      </div>
    </header>
  );
}

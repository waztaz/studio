
"use client";

import LoginForm from "@/components/LoginForm";
import { useAuth } from "@/components/AuthContext";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { Loader2 } from "lucide-react";

export default function LoginPage() {
  const { isLoggedIn, isGuest, isLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && (isLoggedIn || isGuest)) {
      router.push("/");
    }
  }, [isLoggedIn, isGuest, isLoading, router]);

  if (isLoading || isLoggedIn || isGuest) {
    return (
      <div className="flex justify-center items-center min-h-[calc(100vh-200px)]">
        <Loader2 className="h-12 w-12 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div>
      <LoginForm />
    </div>
  );
}

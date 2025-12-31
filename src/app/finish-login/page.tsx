
"use client";

import { useEffect, Suspense } from 'react';
import { useAuth } from '@/components/AuthContext';
import { Loader2 } from 'lucide-react';
import { useSearchParams } from 'next/navigation';

function FinishLoginContent() {
  const { completePasswordlessSignIn, isLoading } = useAuth();
  const searchParams = useSearchParams();

  useEffect(() => {
    // We need to reconstruct the full URL that the user was redirected to.
    const fullUrl = window.location.href;
    completePasswordlessSignIn(fullUrl);
  }, [completePasswordlessSignIn, searchParams]);

  return (
    <div className="flex flex-col items-center justify-center min-h-[calc(100vh-200px)] py-12 gap-4">
      <Loader2 className="h-12 w-12 text-primary animate-spin" />
      <p className="text-muted-foreground">Finalizing your secure sign-in...</p>
    </div>
  );
}


export default function FinishLoginPage() {
    return (
        <Suspense fallback={<div>Loading...</div>}>
            <FinishLoginContent />
        </Suspense>
    )
}

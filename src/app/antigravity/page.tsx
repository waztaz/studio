
"use client";

import { useEffect } from 'react';
import { Loader2 } from 'lucide-react';

export default function AntiGravityPage() {

  useEffect(() => {
    // The classic XKCD comic that `import antigravity` opens.
    const xkcdUrl = 'https://xkcd.com/353/';
    window.location.href = xkcdUrl;
  }, []);

  return (
    <div className="flex flex-col items-center justify-center min-h-[calc(100vh-200px)] py-12 gap-4">
      <Loader2 className="h-12 w-12 text-primary animate-spin" />
      <p className="text-muted-foreground">Engaging antigravity module...</p>
    </div>
  );
}

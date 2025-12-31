
"use client";

import { useAuth } from "@/components/AuthContext";
import BlogPostForm from "@/components/BlogPostForm";
import BlogPostList from "@/components/BlogPostList";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";

export default function Home() {
  const { role, isLoading, isGuest, isLoggedIn } = useAuth();
  const router = useRouter();
  const [shouldRender, setShouldRender] = useState(false);

  useEffect(() => {
    if (!isLoading) {
      if (!isLoggedIn && !isGuest) {
        router.replace('/login');
      } else {
        setShouldRender(true);
      }
    }
  }, [isLoading, isLoggedIn, isGuest, router]);

  if (isLoading || !shouldRender) {
    return (
      <div className="flex justify-center items-center min-h-[calc(100vh-200px)]">
        <Loader2 className="h-12 w-12 animate-spin text-primary" />
      </div>
    );
  }

  const showBlogPostForm = role === "editor" || role === "fullAdmin";
  
  // We need a function to trigger re-fetch in BlogPostList.
  // A simple way is to use a key on BlogPostList that changes.
  const [postListKey, setPostListKey] = useState(Date.now());
  const handlePostAdded = () => {
    setPostListKey(Date.now());
  };

  return (
    <div>
      {showBlogPostForm && <BlogPostForm onPostAdded={handlePostAdded} />}
      <BlogPostList key={postListKey} />
    </div>
  );
}

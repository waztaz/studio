
"use client";

import { useAuth } from "@/components/AuthContext";
import PostCard from "@/components/PostCard";
import { FileText, ShieldX, Loader2 } from "lucide-react";
import React, { useEffect, useState, useCallback, useContext } from "react";
import { collection, query, where, getDocs, orderBy, Timestamp } from 'firebase/firestore';
import type { Post } from "@/types";
import { useToast } from "@/hooks/use-toast";
import { Skeleton } from "./ui/skeleton";
import { useFirebase } from "./FirebaseProvider";

export default function BlogPostList() {
  const { role, user } = useAuth();
  const { db } = useFirebase();
  const { toast } = useToast();
  const [posts, setPosts] = useState<Post[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchPosts = useCallback(async () => {
    if (!db) {
        setIsLoading(false);
        return;
    }
    setIsLoading(true);
    try {
      const postsCollectionRef = collection(db, "posts");
      let q;

      if (role === "fullAdmin" || role === "editor") {
        q = query(postsCollectionRef, orderBy("createdAt", "desc"));
      } else {
        q = query(postsCollectionRef, where("access", "==", "viewer"), orderBy("createdAt", "desc"));
      }

      const querySnapshot = await getDocs(q);
      const fetchedPosts: Post[] = querySnapshot.docs.map((doc) => {
        const data = doc.data();
        return {
          id: doc.id,
          content: data.content,
          authorUsername: data.authorUsername || "Anonymous", 
          authorId: data.authorId,
          imageUrls: data.imageUrls || [],
          access: data.access,
          createdAt: data.createdAt instanceof Timestamp
            ? data.createdAt.toDate().toLocaleString()
            : new Date(data.createdAt).toLocaleString(),
        };
      });
      setPosts(fetchedPosts);
    } catch (error) {
      console.error("Error fetching posts:", error);
       if ((error as any)?.code === 'failed-precondition' && (error as any)?.message?.includes('query requires an index')) {
        toast({
            title: "Database Index Required",
            description: "A required database index is missing. To fix this, go to the Firestore console and create a composite index for the 'posts' collection with 'access' (ascending) and 'createdAt' (descending). A link to create it may be in the browser console.",
            variant: "destructive",
            duration: 15000, 
        });
      } else {
        toast({
            title: "Error Fetching Posts",
            description: "Could not fetch posts from the database.",
            variant: "destructive",
        });
      }
      setPosts([]);
    } finally {
      setIsLoading(false);
    }
  }, [role, toast, db]);

  useEffect(() => {
    fetchPosts();
  }, [fetchPosts, user]); // Refetch when role or user changes


  const visiblePosts = posts.filter(post => {
    if (role === "fullAdmin" || role === "editor") {
      return true; 
    }
    return post.access === "viewer";
  });

  const canCreatePosts = role === "editor" || role === "fullAdmin";
  
  const handlePostAdded = () => {
      fetchPosts();
  }
  
  const handlePostDeleted = () => {
      fetchPosts();
  }

  if (isLoading) {
    return (
        <div className="space-y-8 mt-8">
            <Skeleton className="h-64 w-full" />
            <Skeleton className="h-64 w-full" />
        </div>
    );
  }

  if (visiblePosts.length === 0) {
    return (
      <div className="text-center py-10 text-muted-foreground">
        {canCreatePosts && posts.length === 0 ? (
          <>
            <FileText size={48} className="mx-auto mb-4" />
            <p className="text-xl">No blog posts yet.</p>
            <p>Create your first post using the form above.</p>
          </>
        ) : (
          <>
            <ShieldX size={48} className="mx-auto mb-4" />
            <p className="text-xl">No posts available to display.</p>
            {role === "viewer" && <p>There might be admin-only posts you cannot see.</p>}
            {!canCreatePosts && posts.length > 0 && <p>More posts might be visible to authenticated users.</p>}
          </>
        )}
      </div>
    );
  }

  return (
    <div className="space-y-8 mt-8">
      {visiblePosts.map((post) => (
        <PostCard key={post.id} post={post} onPostDeleted={handlePostDeleted} />
      ))}
    </div>
  );
}

// Pass handlePostAdded to BlogPostForm
import BlogPostForm from "./BlogPostForm";
export function BlogPostFormWrapper() {
    const { role } = useAuth();
    const showBlogPostForm = role === "editor" || role === "fullAdmin";
    const { fetchPosts } = useBlogPostListContext();

    if (!showBlogPostForm) return null;

    return <BlogPostForm onPostAdded={fetchPosts} />;
}

// A simple context to pass fetchPosts down
const blogPostListContext = React.createContext({ fetchPosts: () => {} });
export const useBlogPostListContext = () => useContext(blogPostListContext);

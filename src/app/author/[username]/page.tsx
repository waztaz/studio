
"use client";

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useAuth } from '@/components/AuthContext';
import PostCard from '@/components/PostCard';
import { useFirebase } from '@/components/FirebaseProvider';
import { collection, query, where, getDocs, orderBy, Timestamp } from 'firebase/firestore';
import type { Post } from '@/types';
import { Skeleton } from '@/components/ui/skeleton';
import { User, ArrowLeft, FileText, ShieldX, Image as ImageIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

export default function AuthorPage() {
  const params = useParams();
  const router = useRouter();
  const { db } = useFirebase();
  const { role: currentUserRole, isLoading: authLoading, isLoggedIn } = useAuth();
  const [authorPosts, setAuthorPosts] = useState<Post[]>([]);
  const [isLoadingPosts, setIsLoadingPosts] = useState(true);
  const [authorExists, setAuthorExists] = useState<boolean | null>(null);

  const username = typeof params.username === 'string' ? decodeURIComponent(params.username) : null;
  const postCount = authorPosts.length;
  const imageCount = authorPosts.reduce((acc, post) => acc + (post.imageUrls?.length || 0), 0);

  useEffect(() => {
    if (!authLoading && !isLoggedIn) {
      router.replace("/login");
      return;
    }
    
    if (!username || authLoading || !db) return;

    const fetchAuthorPosts = async () => {
      setIsLoadingPosts(true);
      setAuthorExists(null);
      try {
        const postsCollectionRef = collection(db, "posts");
        
        const existenceQuery = query(postsCollectionRef, where("authorUsername", "==", username));
        const existenceSnapshot = await getDocs(existenceQuery);
        if (existenceSnapshot.empty) {
          setAuthorExists(false);
          setAuthorPosts([]);
          setIsLoadingPosts(false);
          return;
        }
        setAuthorExists(true);

        let visibilityQueryConstraints = [where("authorUsername", "==", username)];
        if (currentUserRole !== "fullAdmin" && currentUserRole !== "editor") {
          visibilityQueryConstraints.push(where("access", "==", "viewer"));
        }
        
        const q = query(postsCollectionRef, ...visibilityQueryConstraints, orderBy("createdAt", "desc"));
        const querySnapshot = await getDocs(q);

        const fetchedPosts: Post[] = querySnapshot.docs.map((doc) => {
          const data = doc.data();
          return {
            id: doc.id,
            content: data.content,
            authorUsername: data.authorUsername,
            imageUrls: data.imageUrls || [],
            access: data.access,
            createdAt: data.createdAt instanceof Timestamp
              ? data.createdAt.toDate().toLocaleString()
              : new Date(data.createdAt).toLocaleString(),
          };
        });
        setAuthorPosts(fetchedPosts);
      } catch (error) {
        console.error("Error fetching author posts:", error);
        setAuthorPosts([]);
        setAuthorExists(false);
      } finally {
        setIsLoadingPosts(false);
      }
    };

    fetchAuthorPosts();
  }, [username, currentUserRole, authLoading, isLoggedIn, router, db]);

  if (authLoading || isLoadingPosts || authorExists === null) {
    return (
      <div className="py-8 space-y-8">
        <Skeleton className="h-8 w-24 mb-4" />
        <div className="flex flex-col items-center gap-4 p-8 bg-card rounded-lg shadow-md border border-border">
            <Skeleton className="h-24 w-24 rounded-full" />
            <Skeleton className="h-8 w-48" />
            <div className="flex gap-8 mt-2">
                <Skeleton className="h-6 w-20" />
                <Skeleton className="h-6 w-20" />
            </div>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8 mt-8">
          <Skeleton className="h-80 w-full" />
          <Skeleton className="h-80 w-full" />
          <Skeleton className="h-80 w-full" />
        </div>
      </div>
    );
  }

  if (!username) {
    return (
        <div className="text-center py-10">
            <p className="text-destructive text-xl">Author username is missing from the URL.</p>
             <Button asChild variant="link" className="mt-4">
                <Link href="/">Go to Homepage</Link>
            </Button>
        </div>
    );
  }
  
  if (authorExists === false) {
     return (
      <div className="text-center py-10 text-muted-foreground">
        <User size={48} className="mx-auto mb-4 text-destructive" />
        <h1 className="text-3xl font-bold mb-4">Author Not Found</h1>
        <p className="mb-6">The author &quot;{username}&quot; does not seem to exist or has no posts.</p>
        <Button asChild variant="outline" className="mt-4">
          <Link href="/">
            <ArrowLeft className="mr-2 h-4 w-4" /> Back to All Posts
          </Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="py-8">
      <div className="mb-8">
        <Button variant="outline" onClick={() => router.back()} className="mb-6">
          <ArrowLeft className="mr-2 h-4 w-4" /> Back
        </Button>
        
        <div className="flex flex-col items-center gap-4 p-8 bg-card rounded-xl shadow-lg border border-border">
            <div className="relative">
                <User size={96} className="text-primary p-5 bg-primary/10 rounded-full" />
            </div>
            <h1 className="text-4xl font-bold text-primary">{username}</h1>
            <div className="flex items-center gap-8 text-muted-foreground mt-2">
                <div className="text-center">
                    <p className="text-2xl font-bold text-foreground">{postCount}</p>
                    <p className="text-sm">Posts</p>
                </div>
                <div className="text-center">
                    <p className="text-2xl font-bold text-foreground">{imageCount}</p>
                    <p className="text-sm">Images</p>
                </div>
            </div>
        </div>
      </div>

      {authorPosts.length === 0 ? (
         <div className="text-center py-16 text-muted-foreground bg-card rounded-lg shadow-md border border-border">
            {currentUserRole === 'viewer' ? 
                <ShieldX size={56} className="mx-auto mb-4 text-primary" /> :
                <FileText size={56} className="mx-auto mb-4 text-primary" />
            }
            <p className="text-2xl font-semibold mb-2">No posts to display from &quot;{username}&quot;.</p>
            {currentUserRole === 'viewer' && <p className="text-md">This author may have posts that are not public, or no posts at all.</p>}
            {(currentUserRole === 'editor' || currentUserRole === 'fullAdmin') && <p className="text-md">This author has not created any posts, or their posts are not public.</p>}
         </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {authorPosts.map((post) => (
            <PostCard key={post.id} post={post} />
          ))}
        </div>
      )}
    </div>
  );
}

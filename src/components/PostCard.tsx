
import type { Post } from "@/types";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CalendarDays, Eye, Image as ImageIcon, ShieldAlert, Trash2, User } from "lucide-react";
import NextImage from "next/image";
import Link from "next/link"; 
import { useAuth } from "./AuthContext";
import { Button } from "./ui/button";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { useState } from "react";

interface PostCardProps {
  post: Post;
  onPostDeleted: () => void;
}

export default function PostCard({ post, onPostDeleted }: PostCardProps) {
  const { role, deletePost, isLoading } = useAuth();
  const [isDeleting, setIsDeleting] = useState(false);

  const contentLines = post.content.split('\n');
  const title = contentLines[0].trim().length > 0 && contentLines[0].trim().length < 100 
    ? contentLines[0].trim()
    : "";
  const remainingContent = title 
    ? contentLines.slice(1).join('\n').trim()
    : post.content;

  const showAccessBadge = role === "editor" || role === "fullAdmin";
  const canDelete = role === "fullAdmin";

  const firstImageUrl = post.imageUrls && post.imageUrls.length > 0 ? post.imageUrls[0] : null;

  const handleDelete = async () => {
    setIsDeleting(true);
    await deletePost(post.id, post.imageUrls, onPostDeleted);
    // No need to set isDeleting to false, component will unmount
  };

  return (
    <Card className="group flex flex-col overflow-hidden shadow-sm hover:shadow-xl transition-shadow duration-300 ease-out border border-border/80 h-full">
      {firstImageUrl && (
        <div className="relative w-full aspect-square overflow-hidden">
          <NextImage
            src={firstImageUrl}
            alt={title || "Blog post image"}
            fill
            style={{ objectFit: 'cover' }}
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
            priority // Prioritize if it's likely to be LCP
            className="transition-transform duration-500 group-hover:scale-105"
            data-ai-hint="article blog"
          />
           <div className="absolute top-2 right-2 flex items-center gap-2">
            {post.imageUrls && post.imageUrls.length > 1 && (
              <Badge variant="outline" className="flex items-center gap-1 backdrop-blur-sm bg-background/70">
                <ImageIcon size={14} />
                {post.imageUrls.length}
              </Badge>
            )}
            {showAccessBadge && (
              <Badge variant={post.access === 'admin' ? 'destructive' : 'secondary'} className="backdrop-blur-sm bg-background/70">
                {post.access === 'admin' ? <ShieldAlert size={14} className="mr-1" /> : <Eye size={14} className="mr-1" />}
                {post.access === 'admin' ? 'Admin' : 'Public'}
              </Badge>
            )}
          </div>
        </div>
      )}
      
      <div className="p-4 flex-grow flex flex-col">
        {title && (
          <CardTitle className="text-lg font-semibold break-words mb-2">{title}</CardTitle>
        )}
        
        {remainingContent && (
          <p className="text-muted-foreground text-sm whitespace-pre-wrap break-words line-clamp-3 flex-grow">
            {remainingContent}
          </p>
        )}
      </div>

      <CardFooter className="bg-secondary/50 p-3 mt-auto text-sm text-muted-foreground flex justify-between items-center gap-3">
        <div className="flex flex-col items-start">
            <div className="flex items-center">
                <User size={14} className="mr-1.5" />
                <span className="mr-1 text-xs">By:</span>
                <Link href={`/author/${encodeURIComponent(post.authorUsername)}`} className="font-medium text-primary hover:underline hover:text-accent transition-colors text-sm">
                    {post.authorUsername}
                </Link>
            </div>
            <div className="flex items-center text-xs mt-1">
                <CalendarDays size={14} className="mr-1.5" />
                <span>{post.createdAt}</span>
            </div>
        </div>
         {canDelete && (
           <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button variant="ghost" size="icon" className="text-destructive/70 hover:text-destructive hover:bg-destructive/10 h-8 w-8 shrink-0" disabled={isLoading || isDeleting}>
                <Trash2 size={16} />
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                <AlertDialogDescription>
                  This action cannot be undone. This will permanently delete the post
                  {post.imageUrls && post.imageUrls.length > 0 && ` and its associated image${post.imageUrls.length > 1 ? 's' : ''}`} from the servers.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel disabled={isDeleting}>Cancel</AlertDialogCancel>
                <AlertDialogAction onClick={handleDelete} disabled={isDeleting || isLoading} className="bg-destructive hover:bg-destructive/90">
                  {isDeleting ? "Deleting..." : "Yes, delete it"}
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        )}
      </CardFooter>
    </Card>
  );
}

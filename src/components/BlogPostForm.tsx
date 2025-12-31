
"use client";

import { useState, type FormEvent, type ChangeEvent } from "react";
import { useAuth } from "@/components/AuthContext";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { useToast } from "@/hooks/use-toast";
import { Edit3, ImageUp, ShieldQuestion, Loader2, XCircle, User, FileText } from "lucide-react";
import type { PostAccess } from "@/types";
import NextImage from "next/image";

interface BlogPostFormProps {
    onPostAdded: () => void;
}

export default function BlogPostForm({ onPostAdded }: BlogPostFormProps) {
  const { addPost, role, isLoading: isAuthLoading } = useAuth();
  const [content, setContent] = useState("");
  const [authorUsername, setAuthorUsername] = useState("");
  const [imageFiles, setImageFiles] = useState<File[]>([]);
  const [imagePreviews, setImagePreviews] = useState<string[]>([]);
  const [postAccess, setPostAccess] = useState<PostAccess>("viewer");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [uploadProgress, setUploadProgress] = useState<{ fileIndex: number; progress: number; totalFiles: number } | null>(null);
  const { toast } = useToast();
  
  const canPost = role === "editor" || role === "fullAdmin";
  const canPostWithImages = role === "fullAdmin";

  const handleImageChange = (event: ChangeEvent<HTMLInputElement>) => {
    if (event.target.files) {
      const filesArray = Array.from(event.target.files);
      setImageFiles(filesArray);

      const newPreviews = filesArray.map(file => URL.createObjectURL(file));
      setImagePreviews(prev => {
        prev.forEach(url => URL.revokeObjectURL(url));
        return newPreviews;
      });
      setUploadProgress(null);
    } else {
      setImageFiles([]);
      imagePreviews.forEach(url => URL.revokeObjectURL(url));
      setImagePreviews([]);
      setUploadProgress(null);
    }
  };

  const removeImage = (indexToRemove: number) => {
    setImageFiles(prevFiles => prevFiles.filter((_, index) => index !== indexToRemove));
    setImagePreviews(prevPreviews => {
      const newPreviews = prevPreviews.filter((_, index) => index !== indexToRemove);
      if (prevPreviews[indexToRemove]) {
          URL.revokeObjectURL(prevPreviews[indexToRemove]);
      }
      return newPreviews;
    });
    if (imageFiles.length === 1) setUploadProgress(null);
  };

  const handleProgressUpdate = (fileIndex: number, progress: number, totalFiles: number) => {
    setUploadProgress({ fileIndex, progress, totalFiles });
  };

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    if (content.trim() === "") {
      toast({
        title: "Empty Post",
        description: "Cannot submit an empty post.",
        variant: "destructive",
      });
      return;
    }
    if (authorUsername.trim() === "") {
      toast({
        title: "Username Required",
        description: "Please enter a username for your post.",
        variant: "destructive",
      });
      return;
    }
    
    setIsSubmitting(true);
    const filesToUpload = canPostWithImages ? imageFiles : [];

    if (filesToUpload.length > 0) {
      setUploadProgress({ fileIndex: 0, progress: 0, totalFiles: filesToUpload.length });
    } else {
      setUploadProgress(null);
    }

    try {
      await addPost(content, authorUsername, onPostAdded, filesToUpload, postAccess, handleProgressUpdate);
      
      setContent("");
      setAuthorUsername("");
      setImageFiles([]);
      imagePreviews.forEach(url => URL.revokeObjectURL(url));
      setImagePreviews([]);
      setPostAccess("viewer");
      if (document.getElementById('postImages') as HTMLInputElement) {
        (document.getElementById('postImages') as HTMLInputElement).value = "";
      }
    } catch (error) {
      console.error("Submission failed in form:", error);
    } finally {
      setIsSubmitting(false);
      setUploadProgress(null); 
    }
  };

  if (!canPost) return null;

  const combinedLoading = isAuthLoading || isSubmitting;

  return (
    <Card className="my-8 shadow-xl">
      <CardHeader>
        <div className="flex items-center gap-2 mb-2">
          {canPostWithImages ? <Edit3 size={24} className="text-primary" /> : <FileText size={24} className="text-primary" />}
          <CardTitle className="text-2xl">Create New Post</CardTitle>
        </div>
        <CardDescription>
          Share your thoughts, add images, set username, and set access level.
        </CardDescription>
      </CardHeader>
      <form onSubmit={handleSubmit}>
        <CardContent className="space-y-6">
          <div>
            <Label htmlFor="authorUsername" className="mb-2 block font-medium flex items-center gap-2">
              <User size={16} className="text-muted-foreground"/> Username
            </Label>
            <Input
              id="authorUsername"
              type="text"
              value={authorUsername}
              onChange={(e) => setAuthorUsername(e.target.value)}
              placeholder="Your display name"
              className="text-base focus:ring-accent focus:border-accent"
              aria-label="Author username"
              disabled={combinedLoading}
              required
            />
          </div>

          <div>
            <Label htmlFor="postContent" className="mb-2 block font-medium">Post Content</Label>
            <Textarea
              id="postContent"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="Start writing your amazing blog post here..."
              rows={8}
              className="text-base focus:ring-accent focus:border-accent"
              aria-label="Blog post content"
              disabled={combinedLoading}
              required
            />
          </div>

          {canPostWithImages && (
            <div className="space-y-2">
              <Label htmlFor="postImages" className="flex items-center gap-2 font-medium">
                <ImageUp size={20} className="text-muted-foreground" />
                Upload Images (Optional)
              </Label>
              <Input
                id="postImages"
                type="file"
                accept="image/*"
                multiple
                onChange={handleImageChange}
                className="file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-primary/10 file:text-primary hover:file:bg-primary/20"
                disabled={combinedLoading}
              />
              {imagePreviews.length > 0 && (
                <div className="mt-4 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                  {imagePreviews.map((previewUrl, index) => (
                    <div key={index} className="relative group aspect-square rounded-md overflow-hidden border border-border">
                      <NextImage 
                        src={previewUrl} 
                        alt={`Image preview ${index + 1}`} 
                        fill 
                        style={{ objectFit: 'cover' }} 
                        sizes="(max-width: 640px) 50vw, (max-width: 768px) 33vw, 25vw"
                        priority={index < 4}
                      />
                      <Button
                        type="button"
                        variant="destructive"
                        size="icon"
                        className="absolute top-1 right-1 h-6 w-6 opacity-70 group-hover:opacity-100 transition-opacity"
                        onClick={() => removeImage(index)}
                        disabled={combinedLoading}
                        aria-label={`Remove image ${index + 1}`}
                      >
                        <XCircle size={16} />
                      </Button>
                    </div>
                  ))}
                </div>
              )}
              {isSubmitting && imageFiles.length > 0 && uploadProgress !== null && (
                <div className="mt-2 space-y-1">
                  <Label className="text-sm text-muted-foreground">
                    Uploading image {uploadProgress.fileIndex + 1} of {uploadProgress.totalFiles}: {Math.round(uploadProgress.progress)}%
                  </Label>
                  <Progress value={uploadProgress.progress} className="w-full h-2" />
                </div>
              )}
            </div>
          )}

          <div className="space-y-2">
            <Label htmlFor="postAccess" className="flex items-center gap-2 font-medium">
              <ShieldQuestion size={20} className="text-muted-foreground" />
              Post Access Level
            </Label>
            <Select 
              value={postAccess} 
              onValueChange={(value: PostAccess) => setPostAccess(value)}
              disabled={combinedLoading}
            >
              <SelectTrigger id="postAccess" className="w-full sm:w-[200px]">
                <SelectValue placeholder="Set Access Level" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="viewer">Public (Visible to Viewers)</SelectItem>
                <SelectItem value="admin">Admin Only (Visible to Editors & Admins)</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
        <CardFooter>
          <Button 
            type="submit" 
            className="w-full sm:w-auto bg-primary hover:bg-primary/90 active:scale-95 transition-transform"
            disabled={combinedLoading}
          >
            {combinedLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                {uploadProgress !== null && imageFiles.length > 0 ? 
                 `Uploading ${uploadProgress.fileIndex + 1}/${uploadProgress.totalFiles}...` : "Publishing..."}
              </>
            ) : (
              "Publish Post"
            )}
          </Button>
        </CardFooter>
      </form>
    </Card>
  );
}

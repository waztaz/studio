
"use client";

import type { ReactNode } from "react";
import React, { createContext, useContext, useState, useEffect, useCallback } from "react";
import type { Role, Post, PostAccess } from "@/types";
import { useRouter } from "next/navigation";
import { useFirebase } from "./FirebaseProvider";
import {
  collection,
  addDoc,
  doc,
  writeBatch,
  setDoc, 
  serverTimestamp,
} from "firebase/firestore";
import { 
  onAuthStateChanged,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  FacebookAuthProvider,
  signInWithPopup,
  signInWithCredential,
  sendSignInLinkToEmail,
  isSignInWithEmailLink,
  signInWithEmailLink,
  type User as FirebaseUser,
  type ActionCodeSettings
} from "firebase/auth";
import { ref, uploadBytesResumable, getDownloadURL, deleteObject, type UploadTask, type UploadTaskSnapshot } from "firebase/storage";
import { useToast } from "@/hooks/use-toast";

interface AuthContextType {
  user: FirebaseUser | null;
  role: Role | null;
  isLoggedIn: boolean;
  isGuest: boolean;
  isLoading: boolean;
  login: (email: string, pass: string, role: Role) => Promise<void>;
  loginWithFacebook: () => Promise<void>;
  sendPasswordlessLink: (email: string) => Promise<void>;
  completePasswordlessSignIn: (url: string) => Promise<void>;
  logout: () => void;
  addPost: (
    content: string,
    authorUsername: string, 
    onPostAdded: () => void,
    imageFiles?: File[] | null,
    accessLevel?: PostAccess,
    onProgress?: (fileIndex: number, progress: number, totalFiles: number) => void
  ) => Promise<void>;
  deletePost: (postId: string, imageUrls: string[] | undefined, onPostDeleted: () => void) => Promise<void>;
  setGuestRole: (role: Role) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const { auth, db, storage } = useFirebase();
  const [user, setUser] = useState<FirebaseUser | null>(null);
  const [role, setRole] = useState<Role | null>(null);
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);
  const [isGuest, setIsGuest] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const router = useRouter();
  const { toast } = useToast();

  useEffect(() => {
    if (!auth) return;
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      setIsLoading(true);
      if (firebaseUser) {
        setUser(firebaseUser);
        const storedRole = localStorage.getItem("accessGateRole") as Role;
        const assignedRole = storedRole || 'viewer';
        setRole(assignedRole);
        setIsLoggedIn(true);
        setIsGuest(false);
      } else {
        const guestRole = sessionStorage.getItem("accessGateGuestRole") as Role;
        if (guestRole) {
            setRole(guestRole);
            setIsGuest(true);
        } else {
            setRole(null);
            setIsGuest(false);
        }
        setUser(null);
        setIsLoggedIn(false);
      }
      setIsLoading(false);
    });

    return () => unsubscribe();
  }, [auth]);

  const setGuestRole = (guestRole: Role) => {
    sessionStorage.setItem("accessGateGuestRole", guestRole);
    setRole(guestRole);
    setIsGuest(true);
    setIsLoggedIn(false);
    setUser(null);
  };


  const login = useCallback(async (email: string, pass: string, answeredRole: Role) => {
    if (!auth) return;
    try {
        await signInWithEmailAndPassword(auth, email, pass);
        localStorage.setItem("accessGateRole", answeredRole);
        sessionStorage.removeItem("accessGateGuestRole"); // Clear guest session
        setRole(answeredRole);
        router.push("/");
    } catch (error: any) {
        if (error.code === 'auth/user-not-found' || error.code === 'auth/invalid-credential') {
            try {
                const userCredential = await createUserWithEmailAndPassword(auth, email, pass);
                localStorage.setItem("accessGateRole", answeredRole);
                sessionStorage.removeItem("accessGateGuestRole"); // Clear guest session
                setRole(answeredRole);
                setUser(userCredential.user);
                setIsLoggedIn(true);
                setIsGuest(false);
                router.push("/");
            } catch (createError: any) {
                toast({ title: "Sign-Up Error", description: createError.message, variant: "destructive" });
                throw createError;
            }
        } else {
            toast({ title: "Login Error", description: error.message, variant: "destructive" });
            throw error;
        }
    }
  }, [router, toast, auth]);
  
  const loginWithFacebook = useCallback(async () => {
    if (!auth) return;
    const provider = new FacebookAuthProvider();
    try {
      const result = await signInWithPopup(auth, provider);
      // The signed-in user info.
      const user = result.user;
      
      // This gives you a Facebook Access Token. You can use it to access the Facebook API.
      const credential = FacebookAuthProvider.credentialFromResult(result);
      const accessToken = credential?.accessToken;
      console.log({accessToken, user});

      localStorage.setItem("accessGateRole", "viewer");
      sessionStorage.removeItem("accessGateGuestRole");
      setRole("viewer");
      router.push("/");

    } catch (error: any) {
        console.error("Facebook Login Error Details:", error);
        if (error.code === 'auth/popup-closed-by-user') {
            toast({ title: "Sign-In Canceled", description: "You closed the sign-in window before completing it.", variant: "default" });
        } else if (error.code === 'auth/account-exists-with-different-credential') {
            toast({ title: "Account Exists", description: "An account already exists with the same email address but different sign-in credentials.", variant: "destructive" });
        } else {
            toast({ title: "Facebook Sign-In Error", description: error.message, variant: "destructive" });
        }
        throw error;
    }
  }, [router, toast, auth]);

  const sendPasswordlessLink = useCallback(async (email: string) => {
    if (!auth) return;
    const actionCodeSettings: ActionCodeSettings = {
      url: `${window.location.origin}/finish-login`,
      handleCodeInApp: true,
    };

    try {
      await sendSignInLinkToEmail(auth, email, actionCodeSettings);
      window.localStorage.setItem('emailForSignIn', email);
      toast({
        title: "Check your email",
        description: `A sign-in link has been sent to ${email}.`,
      });
    } catch (error: any) {
      console.error("Passwordless Link Error:", error);
      toast({
        title: "Error Sending Link",
        description: error.message,
        variant: "destructive",
      });
      throw error;
    }
  }, [toast, auth]);
  
  const completePasswordlessSignIn = useCallback(async (url: string) => {
     if (!auth) return;
     if (isSignInWithEmailLink(auth, url)) {
      let email = window.localStorage.getItem('emailForSignIn');
      if (!email) {
        email = window.prompt('Please provide your email for confirmation');
        if (!email) {
           toast({ title: "Sign-in failed", description: "Email address is required to complete sign-in.", variant: "destructive" });
           router.push('/login');
           return;
        }
      }

      try {
        const result = await signInWithEmailLink(auth, email, url);
        window.localStorage.removeItem('emailForSignIn');
        // On successful login, let's default the role to viewer.
        // This can be expanded later.
        localStorage.setItem("accessGateRole", "viewer");
        sessionStorage.removeItem("accessGateGuestRole"); // Clear guest session
        setRole("viewer");
        setUser(result.user);
        setIsLoggedIn(true);
        setIsGuest(false);
        toast({ title: "Sign-in Successful!", description: "You are now logged in.", variant: "default" });
        router.push("/");
      } catch (error: any) {
        console.error("Error signing in with email link:", error);
        toast({ title: "Sign-in Failed", description: error.message, variant: "destructive" });
        router.push('/login');
      }
    } else {
        toast({ title: "Invalid Link", description: "The sign-in link is invalid or has expired.", variant: "destructive" });
        router.push('/login');
    }
  }, [router, toast, auth]);

  const logout = useCallback(() => {
    if (!auth) return;
    // No need to await signOut, let it happen in the background
    signOut(auth); 
    
    // Clear local/session storage immediately
    localStorage.removeItem("accessGateRole");
    sessionStorage.removeItem("accessGateGuestRole");
    
    // Update state to reflect logged-out status
    setUser(null);
    setRole(null);
    setIsLoggedIn(false);
    setIsGuest(false);
    
    // Redirect immediately for a faster user experience
    router.push("/login");
  }, [router, auth]);

  const addPost = useCallback(async (
    content: string,
    authorUsername: string,
    onPostAdded: () => void,
    imageFiles?: File[] | null,
    accessLevel: PostAccess = "viewer",
    onProgress?: (fileIndex: number, progress: number, totalFiles: number) => void
  ) => {
    if (!user || (role !== "editor" && role !== "fullAdmin")) {
      toast({ title: "Unauthorized", description: "You must be signed in as an Editor or Admin to create posts.", variant: "destructive"});
      throw new Error("Unauthorized to create posts.");
    }
    if (!authorUsername.trim()) {
        toast({ title: "Username Required", description: "Please enter a username for the post.", variant: "destructive"});
        throw new Error("Username required.");
    }
    if (!db || !storage) {
        toast({ title: "Firebase Error", description: "Database or storage service not available.", variant: "destructive"});
        throw new Error("Firebase services not initialized.");
    }

    const newPostRef = doc(collection(db, "posts")); 
    const postId = newPostRef.id;
    
    try {
      let uploadedImageUrls: string[] = [];
      if (imageFiles && imageFiles.length > 0 && (role === "fullAdmin")) {
        const uploadPromises: Promise<string>[] = imageFiles.map((imageFile, i) => {
          return new Promise<string>((resolve, reject) => {
            const imageName = `${new Date().getTime()}_${imageFile.name}`;
            const storageRefPath = `blog_images/${postId}/${imageName}`;
            const fileStorageRef = ref(storage, storageRefPath);
            const uploadTask = uploadBytesResumable(fileStorageRef, imageFile);

            uploadTask.on('state_changed',
              (snapshot: UploadTaskSnapshot) => {
                const rawProgress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
                const currentProgress = isNaN(rawProgress) ? 0 : rawProgress;
                if (onProgress) {
                  onProgress(i, currentProgress, imageFiles.length);
                }
              },
              (error) => {
                console.error(`Upload failed for file ${i + 1} (${imageFile.name}):`, error);
                toast({
                  title: `Image ${i + 1} Upload Failed`,
                  description: `Could not upload ${imageFile.name}. Error: ${(error as any)?.code || error.message}`,
                  variant: "destructive",
                });
                reject(error);
              },
              async () => {
                const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
                resolve(downloadURL);
              }
            );
          });
        });
        
        uploadedImageUrls = await Promise.all(uploadPromises);
      }

      const newPostDoc = {
        content,
        authorUsername,
        authorId: user.uid,
        imageUrls: uploadedImageUrls,
        access: accessLevel,
        createdAt: serverTimestamp(),
      };

      await setDoc(newPostRef, newPostDoc);

      toast({
        title: "Post Created!",
        description: "Your new blog post has been published.",
      });
      onPostAdded();
    } catch (error) {
      console.error("Error during addPost operation:", error);
      toast({
          title: "Error Creating Post",
          description: (error as Error).message || "There was an issue saving your post. Please try again.",
          variant: "destructive",
      });
      throw error;
    }
  }, [user, role, toast, db, storage]);

  const deletePost = useCallback(async (postIdToDelete: string, postImageUrls: string[] | undefined, onPostDeleted: () => void) => {
    if (role !== "fullAdmin") {
        toast({ title: "Unauthorized", description: "You do not have permission to delete posts.", variant: "destructive"});
        return;
    }
    if (!db || !storage) {
        toast({ title: "Firebase Error", description: "Database or storage service not available.", variant: "destructive"});
        return;
    }
    try {
        const postDocRef = doc(db, "posts", postIdToDelete);

        if (postImageUrls && postImageUrls.length > 0) {
            for (const imageUrl of postImageUrls) {
                try {
                  const url = new URL(imageUrl);
                  const pathParts = url.pathname.split('/o/');
                  if (pathParts.length > 1) {
                    const filePathEncoded = pathParts[1].split('?')[0];
                    const filePath = decodeURIComponent(filePathEncoded);
                    const actualStorageRef = ref(storage, filePath);
                    await deleteObject(actualStorageRef);
                  } else {
                    console.warn("Could not parse image path from URL for deletion:", imageUrl);
                  }
                } catch (imgError) {
                  console.warn("Error deleting an image from storage, it might not exist or path is incorrect:", imgError, imageUrl);
                }
            }
        }

        const batch = writeBatch(db);
        batch.delete(postDocRef);
        await batch.commit();

        toast({
            title: "Post Deleted",
            description: "The blog post has been successfully deleted.",
        });
        onPostDeleted();
    } catch (error) {
        console.error("Error deleting post:", error);
        toast({
            title: "Error Deleting Post",
            description: "There was an issue deleting your post. Please try again.",
            variant: "destructive",
        });
    }
  }, [role, toast, db, storage]);


  const contextValue = {
    user,
    role,
    isLoggedIn,
    isGuest,
    isLoading,
    login,
    loginWithFacebook,
    sendPasswordlessLink,
    completePasswordlessSignIn,
    logout,
    addPost,
    deletePost,
    setGuestRole,
  };


  return (
    <AuthContext.Provider value={contextValue}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

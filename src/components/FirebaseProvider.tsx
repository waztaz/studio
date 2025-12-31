
"use client";

import { createContext, useContext, ReactNode, useState, useEffect } from 'react';
import { initializeApp, getApps, getApp, FirebaseApp } from 'firebase/app';
import { getAuth, Auth } from 'firebase/auth';
import { getFirestore, Firestore } from 'firebase/firestore';
import { getStorage, FirebaseStorage } from 'firebase/storage';
import { Loader2 } from 'lucide-react';

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyAHYjcs03xQ4-TXrSy8JdptB6Mi-rFlqUI",
  authDomain: "waztazwebsite-61786124-f0960.firebaseapp.com",
  projectId: "waztazwebsite-61786124-f0960",
  storageBucket: "waztazwebsite-61786124-f0960.appspot.com",
  messagingSenderId: "324839362964",
  appId: "1:324839362964:web:0d0352a80723d94dc87f81"
};


interface FirebaseContextType {
    app: FirebaseApp;
    auth: Auth;
    db: Firestore;
    storage: FirebaseStorage;
}

const FirebaseContext = createContext<FirebaseContextType | undefined>(undefined);

export function FirebaseProvider({ children }: { children: ReactNode }) {
    const [firebase, setFirebase] = useState<FirebaseContextType | null>(null);

    useEffect(() => {
        if (firebaseConfig.apiKey) {
            const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();
            const auth = getAuth(app);
            const db = getFirestore(app);
            const storage = getStorage(app);
            setFirebase({ app, auth, db, storage });
        } else {
             console.error("Firebase configuration is missing. Please check your environment variables.");
        }
    }, []);

    if (!firebase) {
        return (
             <div className="flex flex-col items-center justify-center min-h-screen">
                {!firebaseConfig.apiKey ? (
                    <p className="text-destructive max-w-md text-center">Firebase configuration is invalid.</p>
                ) : (
                    <>
                        <Loader2 className="h-12 w-12 text-primary animate-spin mb-4" />
                        <p className="text-muted-foreground">Connecting to services...</p>
                    </>
                )}
            </div>
        )
    }

    return (
        <FirebaseContext.Provider value={firebase}>
            {children}
        </FirebaseContext.Provider>
    );
}

export function useFirebase() {
    const context = useContext(FirebaseContext);
    if (context === undefined) {
        throw new Error('useFirebase must be used within a FirebaseProvider');
    }
    return context;
}

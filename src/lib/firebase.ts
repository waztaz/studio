import { initializeApp, getApps, getApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyAHYjcs03xQ4-TXrSy8JdptB6Mi-rFlqUI",
  authDomain: "waztazwebsite-61786124-f0960.firebaseapp.com",
  projectId: "waztazwebsite-61786124-f0960",
  storageBucket: "waztazwebsite-61786124-f0960.appspot.com",
  messagingSenderId: "324839362964",
  appId: "1:324839362964:web:0d0352a80723d94dc87f81"
};

// Initialize Firebase
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
const auth = getAuth(app);
const db = getFirestore(app);

export { app, auth, db };

import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/toaster";
import { FirebaseProvider } from "@/components/FirebaseProvider";
import { AuthProvider } from "@/components/AuthContext";
import Header from "@/components/Header";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "waztaz",
  description: "A modern content platform.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <FirebaseProvider>
          <AuthProvider>
            <Header />
            <main className="container mx-auto px-4 py-8">{children}</main>
            <Toaster />
          </AuthProvider>
        </FirebaseProvider>
      </body>
    </html>
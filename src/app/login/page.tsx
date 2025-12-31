
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Link from "next/link";
import { Icons } from "@/components/icons";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { auth, db } from "@/lib/firebase";
import { signInWithEmailAndPassword, onAuthStateChanged } from "firebase/auth";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { RoleQuiz } from "@/components/role-quiz";
import { motion, AnimatePresence } from "framer-motion";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState<"login" | "quiz" | "loading">("loading");
  const [user, setUser] = useState<any>(null);
  const router = useRouter();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      if (currentUser) {
        setUser(currentUser);
        // Check for role
        try {
          const userDoc = await getDoc(doc(db, "users", currentUser.uid));
          if (userDoc.exists() && userDoc.data().role) {
            router.push("/");
          } else {
            setStep("quiz");
          }
        } catch (e) {
          console.error("Error checking role:", e);
          setStep("quiz"); // Default to quiz if check fails (safest, allows retry saving)
        }
      } else {
        setStep("login");
      }
    });
    return () => unsubscribe();
  }, [router]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      await signInWithEmailAndPassword(auth, email, password);
      // specific logic handled by onAuthStateChanged
    } catch (err: any) {
      console.error("Login error:", err);
      if (err.code === 'auth/invalid-credential' || err.code === 'auth/user-not-found' || err.code === 'auth/wrong-password') {
        setError("이메일 또는 비밀번호가 올바르지 않습니다.");
      } else {
        setError("로그인 중 오류가 발생했습니다. 다시 시도해주세요.");
      }
      setLoading(false);
    }
  };

  const handleQuizComplete = async (role: "viewer" | "editor" | null) => {
    if (!role) {
      setError("퀴즈를 통과하지 못했습니다. 다시 시도해주세요.");
      // Maybe sign out or retry?
      return;
    }
    if (user) {
      setLoading(true);
      try {
        await setDoc(doc(db, "users", user.uid), {
          email: user.email,
          role: role,
          updatedAt: new Date().toISOString()
        }, { merge: true });
        router.push("/");
      } catch (err) {
        console.error("Error saving role:", err);
        setError("권한 저장 중 오류가 발생했습니다.");
      } finally {
        setLoading(false);
      }
    }
  };

  if (step === "loading") {
    return <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500"><div className="text-white animate-pulse">Loading...</div></div>;
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 p-4">
      <AnimatePresence mode="wait">
        {step === "login" ? (
          <motion.div
            key="login"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3 }}
            className="w-full max-w-sm"
          >
            <Card className="w-full shadow-2xl bg-white/95 backdrop-blur">
              <CardHeader className="text-center">
                <div className="flex justify-center mb-4">
                  <Link href="/" aria-label="매일이불 홈으로">
                    <Icons.logo className="h-10 w-10 text-primary" />
                  </Link>
                </div>
                <CardTitle className="text-2xl font-headline">Welcome Back</CardTitle>
                <CardDescription>Enter your credentials to access the studio.</CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleLogin} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      type="email"
                      placeholder="name@example.com"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="bg-white/50"
                    />
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <Label htmlFor="password">Password</Label>
                      <Link href="#" className="text-sm text-muted-foreground hover:text-primary">
                        Forgot password?
                      </Link>
                    </div>
                    <Input
                      id="password"
                      type="password"
                      required
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="bg-white/50"
                    />
                  </div>
                  {error && (
                    <div className="text-sm text-destructive font-medium bg-destructive/10 p-3 rounded-md">
                      {error}
                    </div>
                  )}
                  <Button type="submit" className="w-full bg-primary text-primary-foreground hover:bg-primary/90 transition-all font-semibold" disabled={loading}>
                    {loading ? "Signing in..." : "Sign In"}
                  </Button>
                </form>
              </CardContent>
              <CardFooter className="flex flex-col items-center space-y-2">
                <div className="text-sm text-muted-foreground">
                  Don't have an account?{" "}
                  <Link href="#" className="font-semibold text-primary hover:underline">
                    Sign up
                  </Link>
                </div>
              </CardFooter>
            </Card>
          </motion.div>
        ) : (
          <motion.div
            key="quiz"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="w-full max-w-lg"
          >
            <RoleQuiz onComplete={handleQuizComplete} />
            {error && (
              <div className="mt-4 text-center text-white bg-red-500/80 p-2 rounded backdrop-blur">
                {error}
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}


"use client";

import { useState, type FormEvent, Fragment, useMemo } from "react";
import { useAuth } from "@/components/AuthContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import type { Role, Question } from "@/types";
import { AlertCircle, CheckCircle, Feather, Mail, Key, LogIn, UserPlus, BookOpen, Edit, ArrowLeft, ArrowRight, Facebook } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Label } from "./ui/label";
import { difficultyLevels } from "@/config/questions";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "./ui/accordion";
import { useRouter } from "next/navigation";
import { Progress } from "./ui/progress";
import { Separator } from "./ui/separator";


type LoginStep = "intent" | "challenge" | "signIn";
type SignInMode = "password" | "passwordless";


export default function LoginForm() {
  const { login, setGuestRole, loginWithFacebook, sendPasswordlessLink } = useAuth();
  const router = useRouter();
  const { toast } = useToast();

  const [step, setStep] = useState<LoginStep>("intent");
  const [signInMode, setSignInMode] = useState<SignInMode>("password");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);

  const allQuestions = useMemo(() => {
    const questions: Question[] = [];
    difficultyLevels.forEach(level => {
      if (level.questions) {
        questions.push(...level.questions);
      }
      if (level.subLevels) {
        level.subLevels.forEach(subLevel => {
          if (subLevel.questions) {
            questions.push(...subLevel.questions);
          }
        });
      }
    });
    return questions;
  }, []);

  const handleChallengeSubmit = (event: FormEvent) => {
    event.preventDefault();
    setError(null);
    setIsLoading(true);

    let highestRole: Role = "viewer"; 

    difficultyLevels.forEach(level => {
      if (level.subLevels) {
        level.subLevels.forEach(subLevel => {
          const allQuestionsAnswered = subLevel.questions?.every(q => answers[q.id]?.toLowerCase() === q.answer.toLowerCase());
          if (allQuestionsAnswered) {
              if (subLevel.role === 'fullAdmin') highestRole = 'fullAdmin';
              else if (subLevel.role === 'editor' && highestRole !== 'fullAdmin') highestRole = 'editor';
          }
        });
      }
    });
    
    // Check for viewer separately if no higher role was achieved.
    if (highestRole === 'viewer') {
        const editorLevel = difficultyLevels.find(l => l.id === 'adminArea')?.subLevels?.find(s => s.id === 'editor');
        if(editorLevel?.questions?.every(q => answers[q.id]?.toLowerCase() === q.answer.toLowerCase())) {
            highestRole = 'editor';
        }
    }


    setGuestRole(highestRole);
    toast({
      title: "Welcome, Guest!",
      description: `Access level granted: ${highestRole}.`,
      variant: "default",
      action: <CheckCircle className="text-green-500" />,
    });
    router.push("/");
    setIsLoading(false);
  };

  const handleSignInSubmit = async (event: FormEvent) => {
    event.preventDefault();
    setError(null);
    setIsLoading(true);

    if (!email) {
      setError("Please enter your email address.");
      setIsLoading(false);
      return;
    }

    if (signInMode === 'password') {
        if (!password) {
          setError("Please enter your password.");
          setIsLoading(false);
          return;
        }
        
        let role: Role = 'viewer';
        if (password.toLowerCase().includes('admin')) {
          role = 'fullAdmin';
        } else if (password.toLowerCase().includes('editor')) {
          role = 'editor';
        }

        try {
          await login(email, password, role);
          toast({
            title: "Login Successful!",
            description: `Access level granted: ${role}.`,
            variant: "default",
            action: <CheckCircle className="text-green-500" />,
          });
        } catch (err: any) {
          setError(err.message || "An unexpected error occurred.");
          toast({
            title: "Login Failed",
            description: err.message,
            variant: "destructive",
            action: <AlertCircle className="text-white" />,
          });
        } finally {
          setIsLoading(false);
        }
    } else { // Passwordless
        try {
            await sendPasswordlessLink(email);
            setSignInMode("password"); // Reset for next time
        } catch (err: any) {
            setError(err.message || "An unexpected error occurred.");
        } finally {
            setIsLoading(false);
        }
    }
  };

  const handleFacebookSignIn = async () => {
    setError(null);
    setIsLoading(true);
    try {
      await loginWithFacebook();
      toast({
        title: "Facebook Sign-In Successful!",
        description: "You're now logged in.",
        variant: "default",
        action: <CheckCircle className="text-green-500" />,
      });
    } catch (err: any) {
       setError(err.message || "An unexpected error occurred with Facebook Sign-In.");
       toast({
        title: "Facebook Sign-In Failed",
        description: err.message,
        variant: "destructive",
        action: <AlertCircle className="text-white" />,
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleAnswerChange = (questionId: string, value: string) => {
    setAnswers(prev => ({ ...prev, [questionId]: value }));
  };

  const renderCurrentQuestion = () => {
    const question = allQuestions[currentQuestionIndex];
    if (!question) return null;

    return (
      <div className="space-y-4">
        <Label htmlFor={question.id} className="text-lg font-medium text-center block">{question.text}</Label>
        <Input
          id={question.id}
          type="text"
          value={answers[question.id] || ""}
          onChange={(e) => handleAnswerChange(question.id, e.target.value)}
          className="text-base text-center h-12"
          aria-label={question.text}
          disabled={isLoading}
          autoFocus
        />
      </div>
    );
  };
  
  if (step === "intent") {
     return (
       <div className="flex flex-col items-center justify-center min-h-[calc(100vh-200px)] py-12 px-4">
         <Card className="w-full max-w-md shadow-2xl border-border">
           <CardHeader className="text-center">
             <div className="mx-auto mb-4 bg-primary/10 text-primary rounded-full p-3 inline-block">
               <Feather size={32} />
             </div>
             <CardTitle className="text-3xl font-bold">Welcome to waztaz</CardTitle>
             <CardDescription className="text-muted-foreground pt-1">
               How would you like to proceed?
             </CardDescription>
           </CardHeader>
           <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4 p-6">
              <Button variant="outline" className="h-24 flex flex-col gap-2" onClick={() => setStep("challenge")}>
                 <BookOpen size={24} />
                 <span className="text-lg">Read Content</span>
                 <p className="text-xs text-muted-foreground">Enter as a guest</p>
              </Button>
               <Button variant="outline" className="h-24 flex flex-col gap-2" onClick={() => setStep("signIn")}>
                 <Edit size={24} />
                 <span className="text-lg">Write Content</span>
                 <p className="text-xs text-muted-foreground">Sign in to create</p>
               </Button>
           </CardContent>
         </Card>
       </div>
     );
  }


  if (step === "challenge") {
    const progress = Math.round(((currentQuestionIndex + 1) / allQuestions.length) * 100);

    return (
      <div className="flex flex-col items-center justify-center min-h-[calc(100vh-200px)] py-12 px-4">
        <Card id="challenge-card" className="w-full max-w-lg shadow-2xl border-border">
          <CardHeader className="text-center">
             <div className="mx-auto mb-4 bg-primary/10 text-primary rounded-full p-3 inline-block">
                <BookOpen size={32} />
             </div>
            <CardTitle className="text-3xl font-bold">Guest Challenge</CardTitle>
            <CardDescription className="text-muted-foreground pt-1">
              Answer the questions to gain read-only access.
            </CardDescription>
          </CardHeader>
          <form onSubmit={handleChallengeSubmit}>
            <CardContent className="min-h-[150px] flex flex-col justify-center">
              {renderCurrentQuestion()}
            </CardContent>
            <CardFooter className="flex flex-col gap-4">
              <Progress value={progress} className="w-full mb-4" />
              <div className="flex justify-between w-full">
                <Button 
                  type="button"
                  variant="outline" 
                  onClick={() => setCurrentQuestionIndex(prev => prev - 1)}
                  disabled={currentQuestionIndex === 0 || isLoading}
                >
                  <ArrowLeft className="mr-2 h-4 w-4" /> Back
                </Button>

                {currentQuestionIndex < allQuestions.length - 1 ? (
                  <Button 
                    type="button"
                    variant="outline" 
                    onClick={() => setCurrentQuestionIndex(prev => prev + 1)}
                    disabled={isLoading}
                  >
                    Next <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                ) : (
                  <Button type="submit" size="lg" className="w-auto" disabled={isLoading}>
                    {isLoading ? "Verifying..." : "Submit Answers"}
                  </Button>
                )}
              </div>
               <Button variant="link" onClick={() => setStep("intent")} className="mt-4">
                Back to main selection
              </Button>
            </CardFooter>
          </form>
        </Card>
      </div>
    );
  }

  // Sign-in form for content creators
  return (
    <div className="flex flex-col items-center justify-center min-h-[calc(100vh-200px)] py-12 px-4">
      <Card id="login-card" className="w-full max-w-md shadow-2xl border-border">
        <CardHeader className="text-center">
          <div className="mx-auto mb-4 bg-primary/10 text-primary rounded-full p-3 inline-block">
            <UserPlus size={32} />
          </div>
          <CardTitle className="text-3xl font-bold">Creator Sign-In</CardTitle>
          <CardDescription className="text-muted-foreground pt-1">
            {signInMode === 'password' 
                ? "Sign in with your email and password." 
                : "Enter your email to receive a sign-in link."}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSignInSubmit} className="space-y-6">
            <div className="space-y-2">
                <Label htmlFor="email" className="flex items-center gap-2"><Mail size={16}/> Email</Label>
                <Input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="you@example.com"
                    required
                    className="text-base h-12"
                    aria-label="Email Address"
                    disabled={isLoading}
                />
            </div>
             {signInMode === 'password' && (
                <div className="space-y-2">
                    <Label htmlFor="password" className="flex items-center gap-2"><Key size={16}/> Password</Label>
                    <Input
                        id="password"
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="Your password"
                        required
                        className="text-base h-12"
                        aria-label="Password"
                        disabled={isLoading}
                    />
                    <p className="text-xs text-muted-foreground pt-1">Use 'admin' in password for admin role, 'editor' for editor role. New accounts are created automatically.</p>
                </div>
             )}
            
            <Button type="submit" size="lg" className="w-full bg-primary hover:bg-primary/90 active:scale-95 transition-transform" disabled={isLoading}>
              {isLoading 
                ? (signInMode === 'password' ? 'Signing In...' : 'Sending Link...')
                : (signInMode === 'password' ? 'Sign In / Sign Up' : 'Send Sign-In Link')}
            </Button>
          </form>

            <div className="relative my-4">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-background px-2 text-muted-foreground">
                  Or
                </span>
              </div>
            </div>
            
            <div className="space-y-2">
                <Button 
                    variant="outline" 
                    className="w-full" 
                    onClick={() => setSignInMode(signInMode === 'password' ? 'passwordless' : 'password')}
                    disabled={isLoading}
                >
                    {signInMode === 'password' ? 'Sign in with Email Link' : 'Sign in with Password'}
                </Button>
                <Button variant="outline" className="w-full" onClick={handleFacebookSignIn} disabled={isLoading}>
                  <Facebook className="mr-2 h-4 w-4 text-[#1877F2]" />
                  Sign in with Facebook
                </Button>
            </div>

            {error && (
                <Alert variant="destructive" className="mt-6">
                <AlertCircle className="h-4 w-4" />
                <AlertTitle>Error</AlertTitle>
                <AlertDescription>{error}</AlertDescription>
                </Alert>
            )}

        </CardContent>
         <CardFooter className="flex justify-center">
            <Button variant="link" onClick={() => setStep("intent")}>
              Back to main selection
            </Button>
          </CardFooter>
      </Card>
    </div>
  );
}

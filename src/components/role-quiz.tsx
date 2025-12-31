"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { CheckCircle2, Lock } from "lucide-react";

interface RoleQuizProps {
    onComplete: (role: "viewer" | "editor" | null) => void;
}

const questions = [
    {
        id: 1,
        text: "Question 1: What is the primary purpose of this application?",
        options: [
            { id: "a", text: "To waste time" },
            { id: "b", text: "To build amazing web experiences (Correct)" }, // Marked for user clarity in code, displayed normally
            { id: "c", text: "To sleeping" },
        ],
        correct: "b",
    },
    {
        id: 2,
        text: "Question 2: Which command deploys the application?",
        options: [
            { id: "a", text: "npm run deploy" },
            { id: "b", text: "git push origin master" },
            { id: "c", text: "firebase deploy (Correct)" },
        ],
        correct: "c",
    },
];

export function RoleQuiz({ onComplete }: RoleQuizProps) {
    const [answers, setAnswers] = useState<Record<number, string>>({});
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleSubmit = async () => {
        setIsSubmitting(true);
        let score = 0;

        questions.forEach((q) => {
            if (answers[q.id] === q.correct) {
                score++;
            }
        });

        // Artifical delay for "processing" effect
        await new Promise((resolve) => setTimeout(resolve, 1500));

        if (score === 2) {
            onComplete("editor"); // success
        } else if (score === 1) {
            onComplete("viewer"); // success
        } else {
            // Failure case - allow retry
            setIsSubmitting(false);
            setAnswers({}); // Clear answers to force re-selection? Or keep them? Let's keep them but maybe show error.
            // Actually, better to just let onComplete handle the error display in parent, 
            // BUT if parent sets error, this component needs to know to reset state.
            // Simpler: handle "failure" entirely here?
            // Let's call onComplete(null) AND reset state.
            onComplete(null);
        }
    };

    return (
        <Card className="w-full max-w-lg shadow-2xl overflow-hidden border-t-4 border-primary bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/60">
            <CardHeader className="text-center pb-2">
                <div className="mx-auto bg-primary/10 p-3 rounded-full w-fit mb-2">
                    <Lock className="w-6 h-6 text-primary" />
                </div>
                <CardTitle className="text-2xl font-bold tracking-tight">Security Verification</CardTitle>
                <CardDescription>
                    Answer correctly to gain access permissions.
                </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6 pt-4">
                {questions.map((q, index) => (
                    <motion.div
                        key={q.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.2 }}
                        className="space-y-3"
                    >
                        <h3 className="font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                            {q.text}
                        </h3>
                        <RadioGroup
                            onValueChange={(val) => setAnswers(prev => ({ ...prev, [q.id]: val }))}
                            className="grid grid-cols-1 gap-2"
                        >
                            {q.options.map((opt) => (
                                <div key={opt.id} className="flex items-center space-x-2 rounded-lg border p-3 hover:bg-accent hover:text-accent-foreground transition-colors">
                                    <RadioGroupItem value={opt.id} id={`q${q.id}-${opt.id}`} />
                   // Extract text without (Correct) marker if present (for logic above, but cleaner here if I just removed it from object).
                                    // Actually let's just show text. User can edit the file to change questions.
                                    <Label htmlFor={`q${q.id}-${opt.id}`} className="flex-grow cursor-pointer font-normal">
                                        {opt.text.replace(" (Correct)", "")}
                                    </Label>
                                </div>
                            ))}
                        </RadioGroup>
                    </motion.div>
                ))}

                <Button
                    onClick={handleSubmit}
                    className="w-full mt-4"
                    size="lg"
                    disabled={Object.keys(answers).length < questions.length || isSubmitting}
                >
                    {isSubmitting ? (
                        <motion.div
                            animate={{ rotate: 360 }}
                            transition={{ repeat: Infinity, duration: 1 }}
                            className="mr-2 h-4 w-4 border-2 border-b-transparent border-white rounded-full"
                        />
                    ) : (
                        <CheckCircle2 className="mr-2 h-4 w-4" />
                    )}
                    {isSubmitting ? "Verifying..." : "Submit Answers"}
                </Button>
            </CardContent>
        </Card>
    );
}

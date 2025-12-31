
import type { DifficultyLevel } from "@/types";
import { BookOpen, Edit3, ShieldCheck, Shield, Camera } from "lucide-react";

export const difficultyLevels: DifficultyLevel[] = [
  {
    id: "guest",
    name: "Guest Mode",
    icon: BookOpen,
    description: "View blog posts with read-only access. You don't need to answer anything to be a guest viewer.",
    questions: [], // No questions for basic guest
    role: "viewer",
  },
  {
    id: "adminArea",
    name: "Advanced Access",
    icon: Shield,
    description: "Unlock higher permissions by answering the following challenges.",
    subLevels: [
      {
        id: "editor",
        name: "Content Editor",
        icon: Edit3,
        description: "Unlock blog post creation for text-based content.",
        questions: [
          {
            id: "q_editor_1",
            text: "What is my middle name?",
            answer: "Adeel",
            role: "editor",
          },
        ],
      },
      {
        id: "fullAdmin",
        name: "Full Admin Access",
        icon: ShieldCheck,
        description: "Unlock all capabilities including post and image management.",
        questions: [
           {
            id: "q_photo_1",
            text: "What is my compromised password?",
            answer: "Haider123",
            role: "fullAdmin",
          },
          {
            id: "q_admin_1",
            text: "What is my pseudonym web name?",
            answer: "waztaz",
            role: "fullAdmin",
          },
        ],
      },
    ],
  },
];

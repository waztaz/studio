
export type Role = "viewer" | "editor" | "fullAdmin";
export type PostAccess = "admin" | "viewer"; // 'viewer' means public

export interface Post {
  id: string;
  content: string;
  createdAt: string;
  imageUrls?: string[];
  access: PostAccess;
  authorUsername: string;
  authorId: string;
}

export interface Question {
  id:string;
  text: string;
  answer: string;
  role: Role;
}

export interface DifficultyLevel {
  id: string;
  name: string;
  description?: string;
  icon?: React.ElementType;
  questions?: Question[];
  role?: Role;
  subLevels?: DifficultyLevel[];
}

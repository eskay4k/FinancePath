export const levels = ["Beginner", "Intermediate", "Advanced"] as const;
export type Level = (typeof levels)[number];
export interface Question {
  id: string;
  prompt: string;
  options: string[];
  correctIndex: number;
  explanation: string;
}
export interface Source {
  label: string;
  url: string;
}
export interface Term {
  term: string;
  definition: string;
}
export interface Lesson {
  id: string;
  slug: string;
  kind: "decoder" | "fundamentals";
  title: string;
  topic: string;
  minutes: number;
  summary: string;
  headline?: string;
  explanations?: Record<Level, string[]>;
  paragraphs?: string[];
  example?: string;
  terms: Term[];
  matters: string;
  quiz: Question;
  sources: Source[];
  contentReviewedAt: string;
}

import { createContext, type Dispatch, type SetStateAction } from "react";
import type { Progress } from "./progress";
export const ProgressContext = createContext<{
  profile: { name: string } | null;
  deleteLearningData: () => boolean;
  saveProfile: (name: string) => void;
  progress: Progress;
  setProgress: Dispatch<SetStateAction<Progress>>;
  storageAvailable: boolean;
} | null>(null);

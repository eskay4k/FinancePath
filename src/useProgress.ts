import { useContext } from "react";
import { ProgressContext } from "./progress-context";
export function useProgress() {
  const context = useContext(ProgressContext);
  if (!context) throw new Error("ProgressProvider is required");
  return context;
}

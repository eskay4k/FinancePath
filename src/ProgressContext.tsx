import {
  useState,
  useRef,
  useCallback,
  type ReactNode,
  type SetStateAction,
} from "react";
import {
  loadProgress,
  persistProgress,
  freshProgress,
  deleteSavedLearningData,
  type Progress,
} from "./progress";
import { ProgressContext } from "./progress-context";
export function ProgressProvider({ children }: { children: ReactNode }) {
  const [profile, updateProfile] = useState<{ name: string } | null>(() => {
    try {
      const saved = JSON.parse(
        localStorage.getItem("financepath.profile.v1") ?? "null",
      );
      return typeof saved?.name === "string" && saved.name.trim()
        ? { name: saved.name.slice(0, 40) }
        : null;
    } catch {
      return null;
    }
  });
  const [initial] = useState(loadProgress);
  const [progress, updateProgress] = useState(initial.progress);
  const latest = useRef(initial.progress);
  const [storageAvailable, setStorageAvailable] = useState(
    initial.storageAvailable,
  );
  const saveProfile = useCallback((name: string) => {
    const next = { name: name.trim().slice(0, 40) };
    updateProfile(next);
    try {
      localStorage.setItem("financepath.profile.v1", JSON.stringify(next));
    } catch {
      setStorageAvailable(false);
    }
  }, []);
  const setProgress = useCallback((action: SetStateAction<Progress>) => {
    const next = typeof action === "function" ? action(latest.current) : action;
    latest.current = next;
    updateProgress(next);
    if (!persistProgress(next)) setStorageAvailable(false);
  }, []);
  const deleteLearningData = useCallback(() => {
    const next = freshProgress();
    latest.current = next;
    updateProgress(next);
    updateProfile(null);
    try {
      const success = deleteSavedLearningData(localStorage);
      if (!success) setStorageAvailable(false);
      return success;
    } catch {
      setStorageAvailable(false);
      return false;
    }
  }, []);
  return (
    <ProgressContext.Provider
      value={{
        profile,
        saveProfile,
        deleteLearningData,
        progress,
        setProgress,
        storageAvailable,
      }}
    >
      {children}
    </ProgressContext.Provider>
  );
}

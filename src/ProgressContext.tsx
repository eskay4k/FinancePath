import {
  useState,
  useRef,
  useCallback,
  useEffect,
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
import { useAuth } from "./auth-context";
import { supabase } from "./supabase";
import {
  accountCacheKey,
  readAccountCache,
  remoteSnapshot,
  type LearningSnapshot,
} from "./cloud-progress";
export function ProgressProvider({ children }: { children: ReactNode }) {
  const { user, loading } = useAuth();
  if (loading)
    return (
      <div className="container page" role="status">
        Loading your account…
      </div>
    );
  return (
    <SessionProgress
      key={user?.id ?? "guest"}
      userId={user?.id}
      nickname={user?.user_metadata.nickname}
    >
      {children}
    </SessionProgress>
  );
}
function SessionProgress({
  children,
  userId,
  nickname,
}: {
  children: ReactNode;
  userId?: string;
  nickname?: string;
}) {
  const [initial] = useState(() => {
    if (userId) {
      let cache: LearningSnapshot | null = null;
      try {
        cache = readAccountCache(localStorage, userId);
      } catch {
        /* storage unavailable */
      }
      return {
        progress: cache?.progress ?? freshProgress(),
        profile: {
          name:
            cache?.name ??
            (typeof nickname === "string"
              ? nickname.trim().slice(0, 40)
              : "Learner"),
        },
        storageAvailable: true,
      };
    }
    const loaded = loadProgress();
    let profile = null;
    try {
      const saved = JSON.parse(
        localStorage.getItem("financepath.profile.v1") ?? "null",
      );
      if (typeof saved?.name === "string" && saved.name.trim())
        profile = { name: saved.name.trim().slice(0, 40) };
    } catch {
      /* no guest profile */
    }
    return { ...loaded, profile };
  });
  const [profile, updateProfile] = useState(initial.profile);
  const [progress, updateProgress] = useState(initial.progress);
  const [storageAvailable, setStorageAvailable] = useState(
    initial.storageAvailable,
  );
  const [cloudReady, setCloudReady] = useState(!userId);
  const [syncStatus, setSyncStatus] = useState(
    userId ? "Loading saved progress…" : "",
  );
  const latest = useRef<LearningSnapshot>({
    name: initial.profile?.name ?? "Learner",
    progress: initial.progress,
  });
  const revision = useRef(0);
  const active = useRef(true);
  const pending = useRef<LearningSnapshot | null>(null);
  const writing = useRef(false);
  const conflict = useRef(false);
  const deleting = useRef(false);
  function persist(next: LearningSnapshot) {
    try {
      if (userId) {
        localStorage.setItem(accountCacheKey(userId), JSON.stringify(next));
        localStorage.setItem(
          accountCacheKey(userId) + ".draft",
          JSON.stringify(next),
        );
      } else {
        if (!persistProgress(next.progress)) setStorageAvailable(false);
      }
    } catch {
      setStorageAvailable(false);
    }
  }
  const retrySync = useCallback(async () => {
    if (
      !userId ||
      !supabase ||
      !active.current ||
      writing.current ||
      conflict.current ||
      !pending.current
    )
      return;
    writing.current = true;
    setSyncStatus("Saving to your account…");
    try {
      while (pending.current && active.current) {
        const snapshot = pending.current;
        pending.current = null;
        const { data, error } = await supabase.rpc("save_financepath_profile", {
          p_nickname: snapshot.name,
          p_progress: snapshot.progress,
          p_revision: revision.current,
        });
        if (!active.current) return;
        if (error) {
          pending.current = pending.current ?? snapshot;
          conflict.current = error.message.includes("SYNC_CONFLICT");
          setSyncStatus(
            conflict.current
              ? "Another device changed your progress. Reload to get that version; your unsynced work stays in this browser."
              : "Could not sync. Your changes are saved in this browser. Retry when connected.",
          );
          return;
        }
        revision.current = Number(data);
      }
      if (active.current) {
        setSyncStatus("Saved to your account");
        try {
          localStorage.removeItem(accountCacheKey(userId) + ".draft");
        } catch {
          /* optional draft cleanup */
        }
      }
    } catch {
      if (active.current) {
        pending.current = latest.current;
        setSyncStatus(
          "Could not sync. Your changes are saved in this browser. Retry when connected.",
        );
      }
    } finally {
      writing.current = false;
    }
  }, [userId]);
  useEffect(() => {
    active.current = true;
    if (!userId || !supabase)
      return () => {
        active.current = false;
      };
    let cancelled = false;
    Promise.resolve(
      supabase
        .from("financepath_learning_profiles")
        .select("nickname,progress,revision")
        .eq("user_id", userId)
        .maybeSingle(),
    )
      .then(({ data, error }) => {
        if (cancelled) return;
        if (error) {
          setSyncStatus(
            "Could not load your account progress. Reload to try again. Learning changes are paused to avoid overwriting saved work.",
          );
          return;
        }
        const next = data
          ? remoteSnapshot(data.nickname, data.progress)
          : latest.current;
        revision.current = data ? Number(data.revision) : 0;
        latest.current = next;
        updateProfile({ name: next.name });
        updateProgress(next.progress);
        try {
          localStorage.setItem(accountCacheKey(userId), JSON.stringify(next));
        } catch {
          setStorageAvailable(false);
        }
        setCloudReady(true);
        setSyncStatus(
          data ? "Saved to your account" : "Ready to save to your account",
        );
      })
      .catch(() => {
        if (!cancelled)
          setSyncStatus(
            "Could not load your account progress. Reload to try again. Learning changes are paused to avoid overwriting saved work.",
          );
      });
    return () => {
      cancelled = true;
      active.current = false;
      pending.current = null;
    };
  }, [userId]);
  useEffect(() => {
    const retry = () => {
      void retrySync();
    };
    window.addEventListener("online", retry);
    return () => window.removeEventListener("online", retry);
  }, [retrySync]);
  function change(next: LearningSnapshot) {
    latest.current = next;
    if (userId || profile) updateProfile({ name: next.name });
    updateProgress(next.progress);
    persist(next);
    if (userId) {
      pending.current = next;
      void retrySync();
    }
  }
  function saveProfile(name: string) {
    if (cloudReady && !deleting.current && name.trim()) {
      const trimmed = name.trim().slice(0, 40);
      updateProfile({ name: trimmed });
      if (!userId) {
        try {
          localStorage.setItem(
            "financepath.profile.v1",
            JSON.stringify({ name: trimmed }),
          );
        } catch {
          setStorageAvailable(false);
        }
      }
      change({ ...latest.current, name: trimmed });
    }
  }
  function setProgress(action: SetStateAction<Progress>) {
    if (!cloudReady || deleting.current) return;
    const next =
      typeof action === "function" ? action(latest.current.progress) : action;
    change({ ...latest.current, progress: next });
  }
  async function deleteLearningData() {
    if (userId) {
      if (!supabase || !cloudReady || writing.current || conflict.current)
        return false;
      writing.current = true;
      deleting.current = true;
      try {
        const next = { ...latest.current, progress: freshProgress() };
        const { data, error } = await supabase.rpc("save_financepath_profile", {
          p_nickname: next.name,
          p_progress: next.progress,
          p_revision: revision.current,
        });
        if (error || !active.current) return false;
        revision.current = Number(data);
        latest.current = next;
        pending.current = null;
        updateProgress(next.progress);
        persist(next);
        try {
          localStorage.removeItem(accountCacheKey(userId) + ".draft");
        } catch {
          /* optional cleanup */
        }
        setSyncStatus("Saved to your account");
        return true;
      } catch {
        return false;
      } finally {
        writing.current = false;
        deleting.current = false;
      }
    }
    latest.current = { name: "Learner", progress: freshProgress() };
    updateProgress(latest.current.progress);
    updateProfile(null);
    try {
      return deleteSavedLearningData(localStorage);
    } catch {
      return false;
    }
  }
  return (
    <ProgressContext.Provider
      value={{
        profile,
        saveProfile,
        deleteLearningData,
        progress,
        setProgress,
        storageAvailable,
        cloudReady,
        syncStatus,
        retrySync,
      }}
    >
      {children}
    </ProgressContext.Provider>
  );
}

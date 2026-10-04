import { useState, type FormEvent } from "react";
import { Link, Navigate, useNavigate } from "react-router-dom";
import { useAuth } from "../auth-context";
import { useProgress } from "../useProgress";
import { loadProgress, parseProgress } from "../progress";
import { accountCacheKey, mergeLearningProgress } from "../cloud-progress";
import { supabase } from "../supabase";
import { useMetadata } from "../useMetadata";
export function Account() {
  useMetadata("Your account", "Manage your learning profile and account.");
  const { user, signOut } = useAuth();
  const {
    profile,
    progress,
    saveProfile,
    setProgress,
    syncStatus,
    cloudReady,
  } = useProgress();
  const [name, setName] = useState(profile?.name ?? "");
  const [message, setMessage] = useState("");
  const [password, setPassword] = useState("");
  const [confirmation, setConfirmation] = useState("");
  const [busy, setBusy] = useState(false);
  const [guest] = useState(() => loadProgress().progress);
  const [draft] = useState(() => {
    try {
      return user
        ? localStorage.getItem(accountCacheKey(user.id) + ".draft")
        : null;
    } catch {
      return null;
    }
  });
  const navigate = useNavigate();
  if (!user) return <Navigate to="/login" replace />;
  const hasGuest = Boolean(
    guest.selectedLevel ||
    guest.activityDays.length ||
    Object.keys(guest.completedLessons).length,
  );
  async function removeAccount(e: FormEvent) {
    e.preventDefault();
    if (!supabase || !user?.email || confirmation !== "DELETE" || busy) return;
    setBusy(true);
    setMessage("");
    try {
      const { error: authError } = await supabase.auth.signInWithPassword({
        email: user.email,
        password,
      });
      if (authError) {
        setMessage("Could not verify your password. Try again.");
        return;
      }
      const { error } = await supabase.rpc("delete_financepath_account");
      if (error) {
        setMessage(
          "Account deletion failed. Your account remains available. Try again or contact support.",
        );
        return;
      }
      try {
        localStorage.removeItem(accountCacheKey(user.id));
        localStorage.removeItem(accountCacheKey(user.id) + ".draft");
      } catch {
        /* clear via browser settings if unavailable */
      }
      setPassword("");
      await signOut();
      navigate("/login", { replace: true });
    } catch {
      setMessage("Could not connect. Please try again.");
    } finally {
      setBusy(false);
    }
  }
  return (
    <div className="container page account-page">
      <h1 tabIndex={-1}>Your account</h1>
      <p>{user.email}</p>
      <p role="status">{syncStatus}</p>
      <section>
        <h2>What should we call you?</h2>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            saveProfile(name);
            setMessage(
              "Nickname updated. Check the sync status to confirm it is saved.",
            );
          }}
        >
          <label htmlFor="account-name">First name or nickname</label>
          <input
            id="account-name"
            autoComplete="nickname"
            maxLength={40}
            required
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
          <button
            className="button primary"
            disabled={!cloudReady || !name.trim()}
          >
            Save name
          </button>
        </form>
      </section>
      {hasGuest && (
        <section>
          <h2>Bring your earlier progress with you</h2>
          <p>
            This browser has progress from before accounts were introduced.
            Import it into this account to combine completed lessons and
            learning days. Your current account level takes priority.
          </p>
          <button
            className="button secondary"
            onClick={() => {
              setProgress(mergeLearningProgress(progress, guest));
              setMessage(
                "Earlier progress imported. Check the sync status to confirm it is saved.",
              );
            }}
            disabled={!cloudReady}
          >
            Import browser progress
          </button>
        </section>
      )}
      {draft && (
        <details>
          <summary>Recover unsynced work from this browser</summary>
          <p>
            This browser kept a recovery copy of work that may not have reached
            your account. Importing combines it with the loaded account
            progress.
          </p>
          <button
            className="button secondary"
            disabled={!cloudReady || syncStatus.includes("Another device")}
            onClick={() => {
              try {
                const saved = JSON.parse(draft);
                setProgress(
                  mergeLearningProgress(
                    progress,
                    parseProgress(JSON.stringify(saved.progress)),
                  ),
                );
                setMessage("Recovery copy imported. Check sync status.");
              } catch {
                setMessage("Recovery copy could not be read.");
              }
            }}
          >
            Import recovery copy
          </button>
        </details>
      )}
      <section>
        <h2>Password and privacy</h2>
        <Link to="/forgot-password">Reset your password</Link>
        <p>
          <Link to="/legal/privacy">Clear your learning progress</Link> while
          keeping your account, or delete the whole account below.
        </p>
        <details>
          <summary>Delete account permanently</summary>
          <p>
            This deletes your email/password account and cloud learning
            progress. It cannot be undone. Earlier guest progress and copies on
            other devices may remain; clear those browsers separately.
          </p>
          <form onSubmit={removeAccount}>
            <label htmlFor="delete-password">Current password</label>
            <input
              id="delete-password"
              type="password"
              autoComplete="current-password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <label htmlFor="delete-confirm">Type DELETE to confirm</label>
            <input
              id="delete-confirm"
              value={confirmation}
              onChange={(e) => setConfirmation(e.target.value)}
              autoComplete="off"
              required
            />
            <button
              className="button secondary"
              disabled={busy || confirmation !== "DELETE" || !password}
            >
              {busy ? "Deleting…" : "Delete my account"}
            </button>
          </form>
        </details>
      </section>
      {message && <p role="status">{message}</p>}
      <Link to="/dashboard">Back to dashboard</Link>
    </div>
  );
}

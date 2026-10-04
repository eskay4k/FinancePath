import { useState, type FormEvent } from "react";
import { Link, Navigate, useNavigate } from "react-router-dom";
import { useAuth } from "../auth-context";
import { supabase } from "../supabase";
import { useMetadata } from "../useMetadata";
function AccountNotice() {
  return !supabase ? (
    <p role="status" className="auth-notice">
      Accounts are being connected. Signup and login will be available once the
      account service is configured.
    </p>
  ) : null;
}
export function AuthForm({ signup = false }: { signup?: boolean }) {
  useMetadata(
    signup ? "Create your account" : "Log in",
    "Save your learning progress and continue on any device.",
  );
  const { user, loading } = useAuth();
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [consent, setConsent] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [sent, setSent] = useState(false);
  if (loading) return <p role="status">Loading your account…</p>;
  if (user) return <Navigate to="/dashboard" replace />;
  async function submit(e: FormEvent) {
    e.preventDefault();
    if (!supabase || busy) return;
    if (signup && password !== confirm) {
      setError("Your passwords do not match.");
      return;
    }
    setError("");
    setBusy(true);
    try {
      if (signup) {
        const { data, error } = await supabase.auth.signUp({
          email: email.trim(),
          password,
          options: {
            data: {
              nickname: name.trim(),
              age_13_plus: true,
              terms_version: "2026-10-04",
            },
            emailRedirectTo: `${window.location.origin}/auth/confirm`,
          },
        });
        if (error) {
          setError(
            error.code === "weak_password"
              ? "Choose a stronger password with at least 12 characters."
              : "Could not create your account. Try again, or log in if you already have an account.",
          );
          return;
        }
        setPassword("");
        setConfirm("");
        if (data.session) navigate("/assessment?onboarding=1");
        else setSent(true);
      } else {
        const { error } = await supabase.auth.signInWithPassword({
          email: email.trim(),
          password,
        });
        if (error) {
          setError(
            "Could not log in. Check your email and password, and confirm your email if you just signed up.",
          );
          return;
        }
        setPassword("");
        navigate("/dashboard");
      }
    } catch {
      setError(
        "Could not reach the account service. Check your connection and try again.",
      );
    } finally {
      setBusy(false);
    }
  }
  return (
    <div className="setup-page container">
      <section className="setup-card">
        <h1 tabIndex={-1}>
          {signup ? "Your learning, wherever you are." : "Welcome back."}
        </h1>
        <p>
          {signup
            ? "Create an account, find your level, and keep your progress across devices."
            : "Log in to continue your FinancePath journey."}
        </p>
        <AccountNotice />
        {sent ? (
          <div role="status">
            <h2>Check your inbox</h2>
            <p>
              If signup is eligible, a confirmation link will be sent to {email}
              . Open it to verify your email, then find your level. Check spam
              too.
            </p>
            <Link to="/login">Go to login</Link>
            <p>Already registered? Log in or reset your password.</p>
          </div>
        ) : (
          <form onSubmit={submit}>
            {signup && (
              <>
                <label htmlFor="auth-name">First name or nickname</label>
                <input
                  id="auth-name"
                  name="nickname"
                  autoComplete="nickname"
                  maxLength={40}
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
              </>
            )}
            <label htmlFor="auth-email">Email</label>
            <input
              id="auth-email"
              name="email"
              type="email"
              autoComplete="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <label htmlFor="auth-password">Password</label>
            <input
              id="auth-password"
              name="password"
              type="password"
              autoComplete={signup ? "new-password" : "current-password"}
              minLength={signup ? 12 : undefined}
              maxLength={128}
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            {signup && (
              <>
                <p className="profile-note">
                  Use at least 12 characters. Passwords are handled securely by
                  our account provider.
                </p>
                <label htmlFor="auth-confirm">Confirm password</label>
                <input
                  id="auth-confirm"
                  type="password"
                  autoComplete="new-password"
                  required
                  value={confirm}
                  onChange={(e) => setConfirm(e.target.value)}
                />
                <label className="profile-consent">
                  <input
                    type="checkbox"
                    checked={consent}
                    required
                    onChange={(e) => setConsent(e.target.checked)}
                  />
                  I am 13 or older and agree to the{" "}
                  <Link to="/legal/terms">terms of use</Link>.
                </label>
                <p className="profile-policy-links">
                  Our <Link to="/legal/privacy">privacy policy</Link> explains
                  how your email, nickname, and learning progress are stored and
                  synced.
                </p>
              </>
            )}
            {error && (
              <p role="alert" className="auth-error">
                {error}
              </p>
            )}
            <button
              className="button primary"
              type="submit"
              disabled={
                !supabase || busy || (signup && (!consent || !name.trim()))
              }
            >
              {busy ? "Please wait…" : signup ? "Create account" : "Log in"}
            </button>
          </form>
        )}
        <p>
          {signup ? (
            <>
              Already have an account? <Link to="/login">Log in</Link>
            </>
          ) : (
            <>
              New to FinancePath? <Link to="/signup">Create an account</Link>
            </>
          )}
        </p>
        {!signup && <Link to="/forgot-password">Forgot your password?</Link>}
      </section>
      <Link className="back-link" to="/">
        Back to home
      </Link>
    </div>
  );
}
export function ForgotPassword() {
  useMetadata("Reset your password", "Request a password reset email.");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [busy, setBusy] = useState(false);
  async function submit(e: FormEvent) {
    e.preventDefault();
    if (!supabase || busy) return;
    setBusy(true);
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(
        email.trim(),
        { redirectTo: `${window.location.origin}/reset-password` },
      );
      setMessage(
        error
          ? "Could not send the request. Please try again later."
          : "If an account exists for that email, you will receive a reset link. Check your inbox and spam folder.",
      );
    } catch {
      setMessage("Could not connect. Please try again.");
    } finally {
      setBusy(false);
    }
  }
  return (
    <div className="setup-page container">
      <section className="setup-card">
        <h1 tabIndex={-1}>Forgot your password?</h1>
        <p>We’ll email you a link to choose a new one.</p>
        <AccountNotice />
        <form onSubmit={submit}>
          <label htmlFor="reset-email">Email</label>
          <input
            id="reset-email"
            type="email"
            autoComplete="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <button className="button primary" disabled={!supabase || busy}>
            {busy ? "Sending…" : "Send reset link"}
          </button>
        </form>
        {message && <p role="status">{message}</p>}
        <Link to="/login">Back to login</Link>
      </section>
    </div>
  );
}
export function ResetPassword() {
  useMetadata("Choose a new password", "Complete your password reset.");
  const { user, loading, recovery } = useAuth();
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [message, setMessage] = useState("");
  const [busy, setBusy] = useState(false);
  const [done, setDone] = useState(false);
  async function submit(e: FormEvent) {
    e.preventDefault();
    if (!supabase || !user || !recovery || busy) return;
    if (password !== confirm) {
      setMessage("Your passwords do not match.");
      return;
    }
    setBusy(true);
    try {
      const { error } = await supabase.auth.updateUser({ password });
      setMessage(
        error
          ? "Could not update your password. Request a fresh reset link and try again."
          : "Password updated. You can continue learning.",
      );
      if (!error) {
        setDone(true);
        setPassword("");
        setConfirm("");
      }
    } catch {
      setMessage("Could not connect. Please try again.");
    } finally {
      setBusy(false);
    }
  }
  return (
    <div className="setup-page container">
      <section className="setup-card">
        <h1 tabIndex={-1}>Choose a new password</h1>
        {loading ? (
          <p role="status">Checking reset link…</p>
        ) : done ? (
          <Link to="/dashboard">Continue learning</Link>
        ) : !user || !recovery ? (
          <p>
            This reset link is missing or expired.{" "}
            <Link to="/forgot-password">Request another link</Link>.
          </p>
        ) : (
          <form onSubmit={submit}>
            <label htmlFor="new-password">New password</label>
            <input
              id="new-password"
              type="password"
              autoComplete="new-password"
              minLength={12}
              maxLength={128}
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <label htmlFor="confirm-password">Confirm password</label>
            <input
              id="confirm-password"
              type="password"
              autoComplete="new-password"
              required
              value={confirm}
              onChange={(e) => setConfirm(e.target.value)}
            />
            <button className="button primary" disabled={busy}>
              {busy ? "Saving…" : "Save password"}
            </button>
          </form>
        )}
        {message && <p role="status">{message}</p>}
      </section>
    </div>
  );
}
export function AuthConfirm() {
  const { user, loading } = useAuth();
  if (loading) return <p role="status">Confirming your email…</p>;
  return (
    <div className="setup-page container">
      <section className="setup-card">
        <h1 tabIndex={-1}>
          {user ? "Email confirmed." : "Check your confirmation link"}
        </h1>
        {user ? (
          <>
            <p>Your account is ready. Let’s find your starting level.</p>
            <Link className="button primary" to="/dashboard">
              Continue
            </Link>
          </>
        ) : (
          <>
            <p>
              The link may have expired or already been used. Try logging in, or
              request another confirmation below.
            </p>
            <ResendConfirmation />
            <Link to="/login">Go to login</Link>
          </>
        )}
      </section>
    </div>
  );
}
function ResendConfirmation() {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [busy, setBusy] = useState(false);
  async function submit(e: FormEvent) {
    e.preventDefault();
    if (!supabase || busy) return;
    setBusy(true);
    try {
      const { error } = await supabase.auth.resend({
        type: "signup",
        email: email.trim(),
        options: { emailRedirectTo: `${window.location.origin}/auth/confirm` },
      });
      setMessage(
        error
          ? "Could not send the request. Try again later."
          : "If confirmation is pending for this email, a new link will be sent.",
      );
    } catch {
      setMessage("Could not connect. Try again.");
    } finally {
      setBusy(false);
    }
  }
  return (
    <form onSubmit={submit}>
      <label htmlFor="confirm-email">Email</label>
      <input
        id="confirm-email"
        type="email"
        autoComplete="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        required
      />
      <button className="button secondary" disabled={!supabase || busy}>
        Resend confirmation
      </button>
      {message && <p role="status">{message}</p>}
    </form>
  );
}

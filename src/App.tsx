import { Route, Routes, useLocation } from "react-router-dom";
import { Header, Footer, RouteFocus } from "./components/Shell";
import { Policies } from "./pages/Policies";
import { Headlines } from "./pages/Headlines";
import { NewsArticle } from "./pages/NewsArticle";
import { useAuth } from "./auth-context";
import {
  AuthForm,
  ForgotPassword,
  ResetPassword,
  AuthConfirm,
} from "./pages/AuthPages";
import { Account } from "./pages/Account";
import { Signup } from "./pages/Signup";
import { Dashboard } from "./pages/Dashboard";
import { Home } from "./pages/Home";
import { Library } from "./pages/Library";
import { LessonRoute } from "./pages/LessonPage";
import { Assessment } from "./pages/Assessment";
import { ProgressPage } from "./pages/ProgressPage";
import { About } from "./pages/About";
import { NotFound } from "./pages/NotFound";
import { useProgress } from "./useProgress";

export default function App() {
  const { storageAvailable, progress, cloudReady, syncStatus, retrySync } =
    useProgress();
  const { user, error } = useAuth();
  const location = useLocation();
  const learning = !["/", "/signup", "/assessment"].includes(location.pathname);
  return (
    <div
      className={`app-shell ${learning ? `level-${(progress.selectedLevel ?? "Beginner").toLowerCase()}` : ""}`}
    >
      <a href="#main" className="skip-link">
        Skip to main content
      </a>
      <Header />
      {!storageAvailable && (
        <div className="storage-warning" role="status">
          Progress works for this session, but browser storage is unavailable.
          It won’t be saved after you leave.
        </div>
      )}
      {error && (
        <p role="alert" className="storage-warning">
          {error}
        </p>
      )}
      {user && (
        <div className="account-sync" role="status">
          {syncStatus}
          {syncStatus.startsWith("Could not sync") && (
            <button onClick={() => void retrySync()}>Retry sync</button>
          )}
        </div>
      )}
      <main id="main">
        {user && !cloudReady ? (
          <div className="container page">
            <p role="status">{syncStatus}</p>
            <button
              className="button secondary"
              onClick={() => window.location.reload()}
            >
              Reload account
            </button>
          </div>
        ) : (
          <>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/signup" element={<Signup />} />
              <Route path="/account" element={<Account />} />
              <Route path="/login" element={<AuthForm />} />
              <Route path="/forgot-password" element={<ForgotPassword />} />
              <Route path="/reset-password" element={<ResetPassword />} />
              <Route path="/auth/confirm" element={<AuthConfirm />} />
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/assessment" element={<Assessment />} />
              <Route path="/headlines" element={<Headlines />} />
              <Route path="/headlines/:id" element={<NewsArticle />} />
              <Route path="/decoder" element={<Library kind="decoder" />} />
              <Route
                path="/decoder/:slug"
                element={<LessonRoute kind="decoder" />}
              />
              <Route
                path="/fundamentals"
                element={<Library kind="fundamentals" />}
              />
              <Route
                path="/fundamentals/:slug"
                element={<LessonRoute kind="fundamentals" />}
              />
              <Route path="/progress" element={<ProgressPage />} />
              <Route path="/legal/:kind" element={<Policies />} />
              <Route path="/about" element={<About />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
            <RouteFocus />
          </>
        )}
      </main>
      <Footer />
    </div>
  );
}

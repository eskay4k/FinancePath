import { Route, Routes, useLocation } from "react-router-dom";
import { Header, Footer, RouteFocus } from "./components/Shell";
import { Policies } from "./pages/Policies";
import { Headlines } from "./pages/Headlines";
import { NewsArticle } from "./pages/NewsArticle";
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
  const { storageAvailable, progress } = useProgress();
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
      <main id="main">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/signup" element={<Signup />} />
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
      </main>
      <Footer />
    </div>
  );
}

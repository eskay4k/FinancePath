import { useAuth } from "../auth-context";
import { supabase } from "../supabase";
import { Link, Navigate } from "react-router-dom";
import { ArrowRight, CircleCheck, Sprout, Newspaper } from "lucide-react";
import { lessons, fundamentalLessons, decoderLessons } from "../data/lessons";
import { useProgress } from "../useProgress";
import { useMetadata } from "../useMetadata";
import { useState } from "react";
import { Companion } from "../components/Companion";
import { LearningCalendar } from "../components/LearningCalendar";
import { LevelSelector } from "../components/LevelSelector";
import { recommendLevel } from "../data/assessment";
import { totals } from "../progress";
export function Dashboard() {
  useMetadata(
    "Your learning dashboard",
    "Your next lesson, learning path, and finance progress, all in one place.",
  );
  const { profile, progress, setProgress } = useProgress();
  const { user } = useAuth();
  const [changingLevel, setChangingLevel] = useState(false);
  if (supabase && !user) return <Navigate to="/login" replace />;
  if (!profile) return <Navigate to="/signup" replace />;
  if (!progress.selectedLevel)
    return <Navigate to="/assessment?onboarding=1" replace />;
  const count = totals(progress);
  const ordered =
    progress.selectedLevel === "Beginner"
      ? [...fundamentalLessons, ...decoderLessons]
      : [...decoderLessons, ...fundamentalLessons];
  const next =
    ordered.find((l) => !progress.completedLessons[l.id]) ?? ordered[0];
  const completed = fundamentalLessons.filter(
    (l) => progress.completedLessons[l.id],
  ).length;
  const allDone = count.completed === lessons.length;
  return (
    <div className="dashboard container page">
      <div className="dashboard-heading">
        <div>
          <h1 tabIndex={-1}>
            {progress.selectedLevel === "Advanced"
              ? `Welcome back, ${profile.name}.`
              : `Hey ${profile.name}, let’s learn.`}
          </h1>
          <p>
            {progress.selectedLevel === "Advanced"
              ? "Your reading and learning workspace."
              : progress.selectedLevel === "Intermediate"
                ? "Build connections. Grow your understanding."
                : "One small step is a good place to start."}
          </p>
        </div>
        <button
          className="level-pill"
          aria-expanded={changingLevel}
          aria-controls="dashboard-level-settings"
          onClick={() => setChangingLevel(!changingLevel)}
        >
          {progress.selectedLevel} · Change level
        </button>
      </div>
      {changingLevel && (
        <section
          id="dashboard-level-settings"
          className="dashboard-level-settings"
        >
          <h2>Your level, your choice.</h2>
          {progress.assessment && (
            <p>
              Recommended from your quiz:{" "}
              <strong>{recommendLevel(progress.assessment.score)}</strong> (
              {progress.assessment.score}/6).
            </p>
          )}
          <LevelSelector
            value={progress.selectedLevel}
            onChange={(selectedLevel) =>
              setProgress((p) => ({ ...p, selectedLevel }))
            }
            label="Dashboard learning level"
          />
          <p>
            Your companion, reading guidance, and interface update together.
            Your progress stays with you.
          </p>
          <Link to="/assessment">Retake the level quiz</Link>
        </section>
      )}
      <Companion key={progress.selectedLevel} level={progress.selectedLevel} />
      <section className="dashboard-next">
        <span className="path-badge">
          <Sprout size={28} aria-hidden="true" />
        </span>
        <div>
          <span className="next-label">
            {allDone ? "Something to revisit" : "Your next lesson"}
          </span>
          <h2>{next.title}</h2>
          <p>
            {next.minutes} minutes ·{" "}
            {next.kind === "fundamentals"
              ? "Money basics"
              : "Headline practice"}
          </p>
        </div>
        <Link className="button primary" to={`/${next.kind}/${next.slug}`}>
          {allDone
            ? "Revisit lesson"
            : count.completed
              ? "Continue learning"
              : "Start lesson"}
          <ArrowRight size={18} aria-hidden="true" />
        </Link>
      </section>
      <div className="dashboard-grid">
        <section className="path-panel">
          <div className="path-heading">
            <div>
              <h2>Your basics path</h2>
              <p>{completed} of 5 lessons completed. Explore in any order.</p>
            </div>
          </div>
          <ol className="learning-path">
            {fundamentalLessons.map((l, i) => (
              <li
                key={l.id}
                className={
                  progress.completedLessons[l.id]
                    ? "done"
                    : l.id === next.id
                      ? "next"
                      : ""
                }
              >
                <Link to={`/fundamentals/${l.slug}`}>
                  <span className="path-node">
                    {progress.completedLessons[l.id] ? (
                      <CircleCheck size={26} aria-hidden="true" />
                    ) : (
                      i + 1
                    )}
                  </span>
                  <span className="path-node-copy">
                    <strong>{l.title}</strong>
                    <span>
                      {l.minutes} min ·{" "}
                      {progress.completedLessons[l.id]
                        ? "Completed"
                        : "Ready when you are"}
                    </span>
                  </span>
                </Link>
              </li>
            ))}
          </ol>
        </section>
        <aside className="dashboard-sidebar">
          <LearningCalendar />
          <section className="dashboard-progress">
            <h2>Your progress</h2>
            <strong>
              {count.completed}
              <span> / 15 lessons</span>
            </strong>
            <progress
              value={count.completed}
              max={15}
              aria-label="Completed lessons"
            />
            <p>{count.correct} lesson questions answered correctly</p>
            <Link className="text-link" to="/progress">
              See your progress <ArrowRight size={17} aria-hidden="true" />
            </Link>
          </section>
          <section className="dashboard-headlines">
            <Newspaper size={27} aria-hidden="true" />
            <h2>Curious about the news?</h2>
            <p>
              Read real financial stories with guidance matched to your level.
            </p>
            <Link className="button secondary" to="/headlines">
              Explore headlines
            </Link>
          </section>
        </aside>
      </div>
      <p className="dashboard-storage">
        Your profile and progress are saved in this browser.{" "}
        <Link to="/signup">Edit your name</Link>
      </p>
    </div>
  );
}

import { LearningCalendar } from "../components/LearningCalendar";
import { useState, useRef } from "react";
import { Link } from "react-router-dom";
import {
  ArrowRight,
  ArrowUpRight,
  BookOpen,
  Check,
  CircleCheck,
  GraduationCap,
  RotateCcw,
  TrendingUp,
} from "lucide-react";
import { lessons } from "../data/lessons";
import { useProgress } from "../useProgress";
import { resetProgress, totals } from "../progress";
import { useMetadata } from "../useMetadata";

export function ProgressPage() {
  useMetadata(
    "Your progress",
    "See your learning level, completed lessons, and quiz progress. Stored only in this browser.",
  );
  const { progress, setProgress } = useProgress();
  const [confirmReset, setConfirmReset] = useState(false);
  const resetButtonRef = useRef<HTMLButtonElement>(null);
  const confirmationRef = useRef<HTMLDivElement>(null);
  function closeConfirmation() {
    setConfirmReset(false);
    requestAnimationFrame(() => resetButtonRef.current?.focus());
  }
  const count = totals(progress);
  const recent = Object.entries(progress.completedLessons)
    .sort((a, b) => Date.parse(b[1]) - Date.parse(a[1]))
    .slice(0, 5)
    .map(([id, date]) => ({ lesson: lessons.find((l) => l.id === id)!, date }));
  return (
    <div className="container page progress-page">
      <div className="page-intro">
        <span className="section-label">
          <TrendingUp size={18} aria-hidden="true" /> Every step counts
        </span>
        <h1 tabIndex={-1}>Look how far you’ve come.</h1>
        <p>
          Your progress lives in this browser. Come back whenever you’re ready
          for the next step.
        </p>
      </div>
      <div className="progress-stats">
        <div>
          <span>Lessons completed</span>
          <strong>
            {count.completed}
            <small> / 15</small>
          </strong>
          <span>Each lesson, a little more clarity</span>
        </div>
        <div>
          <span>Questions answered correctly</span>
          <strong>
            {count.correct}
            <small> / 15</small>
          </strong>
          <span>One count per unique question</span>
        </div>
        <div>
          <span>Your learning level</span>
          <strong className="level-stat">
            {progress.selectedLevel ?? "Your choice"}
          </strong>
          <span>
            {progress.selectedLevel
              ? "Change it whenever you like"
              : "You haven’t selected a level yet"}
          </span>
          <Link to="/assessment" className="text-link">
            {progress.selectedLevel ? "Revisit your level" : "Find your level"}
            <ArrowUpRight size={16} aria-hidden="true" />
          </Link>
        </div>
      </div>
      <div className="progress-calendar">
        <LearningCalendar />
      </div>
      <section className="progress-overview">
        <div>
          <h2>Your learning path</h2>
          <span>{Math.round((count.completed / 15) * 100)}% complete</span>
        </div>
        <progress
          value={count.completed}
          max={15}
          aria-label="Overall lesson completion"
        />
        <p>
          {count.completed === 0
            ? "A fresh start. Choose any lesson that sparks your curiosity."
            : count.completed === 15
              ? "You’ve explored all 15 lessons. Revisit a concept or try a deeper explanation whenever you like."
              : `${15 - count.completed} more lessons to explore. No rush.`}
        </p>
      </section>
      <div className="progress-columns">
        <section>
          <div className="section-heading">
            <h2>Recently completed</h2>
            <CircleCheck size={22} aria-hidden="true" />
          </div>
          {recent.length ? (
            <ul className="recent-list">
              {recent.map(({ lesson, date }) => (
                <li key={lesson.id}>
                  <Link to={`/${lesson.kind}/${lesson.slug}`}>
                    <span className="recent-icon">
                      <Check size={18} aria-hidden="true" />
                    </span>
                    <div>
                      <strong>{lesson.title}</strong>
                      <span>
                        {lesson.kind === "decoder"
                          ? "Headline practice"
                          : "Money basics"}{" "}
                        ·{" "}
                        {new Date(date).toLocaleDateString("en-US", {
                          month: "short",
                          day: "numeric",
                        })}
                      </span>
                    </div>
                    <ArrowUpRight size={18} aria-hidden="true" />
                  </Link>
                </li>
              ))}
            </ul>
          ) : (
            <div className="empty-state compact">
              <BookOpen size={28} aria-hidden="true" />
              <h3>Your first lesson is waiting.</h3>
              <p>Mark a lesson complete and it will appear here.</p>
              <Link to="/decoder" className="button primary">
                Explore headlines <ArrowRight size={17} aria-hidden="true" />
              </Link>
            </div>
          )}
        </section>
        <aside className="next-step-panel">
          <GraduationCap size={30} aria-hidden="true" />
          <h2>Build on what you know.</h2>
          <p>
            From ownership to purchasing power, money basics gives the news a
            little more context.
          </p>
          <Link to="/fundamentals" className="button secondary">
            Explore money basics <ArrowRight size={17} aria-hidden="true" />
          </Link>
        </aside>
      </div>
      <section className="reset-section">
        <div>
          <h2>A fresh start?</h2>
          <p>
            Reset lesson completions, quiz results, article reads, and learning
            days. Your selected level stays the same.
          </p>
        </div>
        {!confirmReset ? (
          <button
            className="text-button"
            ref={resetButtonRef}
            onClick={() => {
              setConfirmReset(true);
              requestAnimationFrame(() => confirmationRef.current?.focus());
            }}
          >
            <RotateCcw size={16} aria-hidden="true" /> Reset Progress
          </button>
        ) : (
          <div
            className="reset-confirm"
            ref={confirmationRef}
            tabIndex={-1}
            role="group"
            aria-label="Confirm resetting progress"
          >
            <p>
              Clear your saved completions, quiz results, article reads, and
              streak history?
            </p>
            <button
              className="button danger"
              onClick={() => {
                setProgress(resetProgress);
                closeConfirmation();
              }}
            >
              Yes, reset progress
            </button>
            <button className="button secondary" onClick={closeConfirmation}>
              Keep my progress
            </button>
          </div>
        )}
      </section>
    </div>
  );
}

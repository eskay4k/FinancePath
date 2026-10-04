import { Link, useLocation } from "react-router-dom";
import {
  ArrowLeft,
  ArrowRight,
  ArrowUpRight,
  Check,
  CircleCheck,
  Clock3,
  Compass,
  ExternalLink,
  Wallet,
} from "lucide-react";
import { decoderLessons, fundamentalLessons, lessons } from "../data/lessons";
import type { Lesson } from "../data/types";
import { useProgress } from "../useProgress";
import { completeLesson } from "../progress";
import { LevelSelector } from "../components/LevelSelector";
import { WordReader } from "../components/WordReader";
import { Quiz } from "../components/Quiz";
import { NotFound } from "./NotFound";
import { useMetadata } from "../useMetadata";

export function LessonPage({ lesson }: { lesson: Lesson }) {
  const { progress, setProgress } = useProgress();
  const location = useLocation();
  const returnTo = (location.state as { returnTo?: string } | null)?.returnTo;
  const safeReturn =
    returnTo &&
    (returnTo === `/${lesson.kind}` || returnTo.startsWith(`/${lesson.kind}?`))
      ? returnTo
      : `/${lesson.kind}`;
  const level = progress.selectedLevel ?? "Beginner";
  const completed = !!progress.completedLessons[lesson.id];
  const all = lesson.kind === "decoder" ? decoderLessons : fundamentalLessons;
  const index = all.findIndex((l) => l.id === lesson.id);
  const next = all[index + 1];
  useMetadata(lesson.title, lesson.summary);
  return (
    <div className="container page lesson-page">
      <Link className="back-link" to={safeReturn}>
        <ArrowLeft size={16} aria-hidden="true" /> Back to{" "}
        {lesson.kind === "decoder" ? "Headline practice" : "Money basics"}
      </Link>
      <div className="lesson-layout">
        <article className="lesson-main">
          <div className="lesson-meta">
            <span className="topic-tag">{lesson.topic}</span>
            <span>
              <Clock3 size={15} aria-hidden="true" /> {lesson.minutes} min read
            </span>
            {completed && (
              <span>
                <CircleCheck size={16} aria-hidden="true" /> Completed
              </span>
            )}
          </div>
          <h1 tabIndex={-1}>{lesson.title}</h1>
          <p className="lesson-summary">{lesson.summary}</p>
          {lesson.headline && (
            <div className="lesson-headline">
              <span className="sample-label">
                Illustrative headline · Not live news
              </span>
              <h2>{lesson.headline}</h2>
            </div>
          )}
          {lesson.explanations ? (
            <section className="reading-section">
              <div className="explanation-heading">
                <h2>Your explanation</h2>
                <span>
                  {progress.selectedLevel === null
                    ? "Beginner preview · choose any level"
                    : "Switch levels at any time"}
                </span>
              </div>
              <LevelSelector
                value={level}
                onChange={(selectedLevel) =>
                  setProgress((p) => ({ ...p, selectedLevel }))
                }
              />
              <div aria-live="polite" className="explanation-body">
                <WordReader
                  key={level}
                  paragraphs={lesson.explanations[level]}
                />
              </div>
            </section>
          ) : (
            <section className="reading-section">
              <h2>The idea, simply explained</h2>
              <WordReader paragraphs={lesson.paragraphs ?? []} />
            </section>
          )}
          {lesson.example && (
            <section className="practical-example">
              <div className="section-label">
                <Wallet size={19} aria-hidden="true" /> An everyday example
              </div>
              <p>{lesson.example}</p>
            </section>
          )}
          <section className="reading-section terms-mobile">
            <h2>Three terms to know</h2>
            <Terms lesson={lesson} />
          </section>
          <section className="reading-section matters">
            <h2>Why this matters to you</h2>
            <p>{lesson.matters}</p>
          </section>
          <Quiz key={lesson.quiz.id} question={lesson.quiz} />
          <section className="completion-section">
            <div>
              <h2>
                {completed
                  ? "Another step, understood."
                  : "Ready to take the next step?"}
              </h2>
              <p>
                {completed
                  ? "This lesson is saved in your progress."
                  : "Mark this lesson complete whenever you’re ready. Your quiz score doesn’t affect completion."}
              </p>
            </div>
            <button
              className={`button ${completed ? "secondary" : "primary"}`}
              disabled={completed}
              onClick={() => setProgress((p) => completeLesson(p, lesson.id))}
            >
              {completed ? (
                <>
                  <Check size={18} aria-hidden="true" /> Completed
                </>
              ) : (
                <>
                  Mark as complete <Check size={18} aria-hidden="true" />
                </>
              )}
            </button>
            <div role="status" className="sr-only">
              {completed ? "Lesson completed and saved to your progress." : ""}
            </div>
          </section>
          <section className="sources-section">
            <h2>Go to the source</h2>
            <p>Educational references for the concepts in this lesson.</p>
            <ul>
              {lesson.sources.map((s) => (
                <li key={s.url}>
                  <a href={s.url} target="_blank" rel="noopener noreferrer">
                    {s.label}
                    <ExternalLink size={15} aria-hidden="true" />
                    <span className="sr-only"> (opens in a new tab)</span>
                  </a>
                </li>
              ))}
            </ul>
            <p className="review-date">
              Content reviewed{" "}
              {new Intl.DateTimeFormat("en-US", {
                month: "long",
                day: "numeric",
                year: "numeric",
                timeZone: "UTC",
              }).format(new Date(lesson.contentReviewedAt))}{" "}
              · Educational content, not financial advice.
            </p>
          </section>
          {next && (
            <Link
              className="next-lesson"
              to={`/${lesson.kind}/${next.slug}`}
              state={{ returnTo: safeReturn }}
            >
              <div>
                <span>Keep exploring</span>
                <strong>{next.title}</strong>
              </div>
              <ArrowRight size={21} aria-hidden="true" />
            </Link>
          )}
        </article>
        <aside className="lesson-sidebar">
          <div className="terms-panel">
            <span className="section-label">A little context</span>
            <h2>Terms to know</h2>
            <Terms lesson={lesson} />
          </div>
          <div className="sidebar-note">
            <Compass size={25} aria-hidden="true" />
            <h3>You set the pace.</h3>
            <p>
              A lesson or quiz can count toward your daily learning streak. Take
              the time you need to understand it.
            </p>
            <Link to="/progress">
              See your progress <ArrowUpRight size={16} aria-hidden="true" />
            </Link>
          </div>
        </aside>
      </div>
    </div>
  );
}
function Terms({ lesson }: { lesson: Lesson }) {
  return (
    <dl className="terms-list">
      {lesson.terms.map((t) => (
        <div key={t.term}>
          <dt>{t.term}</dt>
          <dd>{t.definition}</dd>
        </div>
      ))}
    </dl>
  );
}
export function LessonRoute({ kind }: { kind: Lesson["kind"] }) {
  const location = useLocation();
  const slug = location.pathname.split("/").at(-1);
  const lesson = lessons.find((l) => l.kind === kind && l.slug === slug);
  return lesson ? <LessonPage key={lesson.id} lesson={lesson} /> : <NotFound />;
}

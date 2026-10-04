import { Link, useLocation, useSearchParams } from "react-router-dom";
import {
  ArrowUpRight,
  BookOpen,
  GraduationCap,
  Landmark,
  Search,
} from "lucide-react";
import { decoderLessons, fundamentalLessons } from "../data/lessons";
import { useProgress } from "../useProgress";
import { LessonCard } from "../components/LessonCard";
import { useMetadata } from "../useMetadata";

export function Library({ kind }: { kind: "decoder" | "fundamentals" }) {
  const decoder = kind === "decoder";
  const [params, setParams] = useSearchParams();
  const search = params.get("q") ?? "";
  const topic = params.get("topic") ?? "";
  const { progress } = useProgress();
  const all = decoder ? decoderLessons : fundamentalLessons;
  const filtered = all.filter(
    (l) =>
      (!topic || l.topic === topic) &&
      (!search ||
        [l.title, l.headline ?? "", l.topic, ...l.terms.map((t) => t.term)]
          .join(" ")
          .toLowerCase()
          .includes(search.toLowerCase())),
  );
  const location = useLocation();
  useMetadata(
    decoder ? "Headline Decoder" : "Finance Fundamentals",
    decoder
      ? "Explore ten illustrative financial headlines, explained at three learning levels."
      : "Build your foundation with five short lessons in everyday finance.",
  );
  function updateFilter(key: string, value: string) {
    const next = new URLSearchParams(params);
    if (value) next.set(key, value);
    else next.delete(key);
    setParams(next, { replace: true });
  }
  return (
    <div className="container page library-page">
      <div className="page-intro">
        <div className="section-label">
          {decoder ? (
            <>
              <BookOpen size={18} aria-hidden="true" /> Headline practice
              lessons
            </>
          ) : (
            <>
              <GraduationCap size={19} aria-hidden="true" /> Build your
              foundation
            </>
          )}
        </div>
        <h1 tabIndex={-1}>
          {decoder
            ? "Practice understanding the headlines."
            : "Small lessons. A strong foundation."}
        </h1>
        <p>
          {decoder
            ? "Explore what’s happening in the financial world, one concept at a time. Every headline is an illustrative example, not live news."
            : "Five short lessons. Everyday examples. The building blocks that help the bigger picture make sense."}
        </p>
      </div>
      <div className="library-context">
        <span>
          {all.length} lessons <span className="context-divider" />{" "}
          {decoder ? "Three levels of understanding" : "About 3 minutes each"}
        </span>
        <Link to="/assessment">
          {progress.selectedLevel
            ? `Your level: ${progress.selectedLevel}`
            : "Not sure where to start? Find your level"}{" "}
          <ArrowUpRight size={16} aria-hidden="true" />
        </Link>
      </div>
      {decoder && (
        <div className="filters">
          <div className="search-field">
            <Search size={20} aria-hidden="true" />
            <label htmlFor="lesson-search" className="sr-only">
              Search headlines, topics, and terms
            </label>
            <input
              id="lesson-search"
              type="search"
              value={search}
              placeholder="Search headlines, topics, or terms"
              onChange={(e) => updateFilter("q", e.target.value)}
            />
          </div>
          <div className="topic-filter">
            <label htmlFor="topic-filter">Topic</label>
            <select
              id="topic-filter"
              value={topic}
              onChange={(e) => updateFilter("topic", e.target.value)}
            >
              <option value="">All topics</option>
              {all.map((l) => (
                <option value={l.topic} key={l.topic}>
                  {l.topic}
                </option>
              ))}
            </select>
          </div>
        </div>
      )}
      <div className="results-summary" role="status">
        {decoder && (search || topic)
          ? `${filtered.length} matching ${filtered.length === 1 ? "lesson" : "lessons"}`
          : decoder
            ? "What are you curious about?"
            : "Learn in any order, at your own pace"}
      </div>
      {filtered.length ? (
        <div className="lesson-grid">
          {filtered.map((l) => (
            <LessonCard
              lesson={l}
              key={l.id}
              returnTo={location.pathname + location.search}
            />
          ))}
        </div>
      ) : (
        <div className="empty-state">
          <Search size={32} aria-hidden="true" />
          <h2>No headlines match just yet.</h2>
          <p>
            Try a different term or clear your filters to explore all ten
            lessons.
          </p>
          <button className="button primary" onClick={() => setParams({})}>
            Reset Filters
          </button>
        </div>
      )}
      {decoder && (
        <aside className="library-footnote">
          <Landmark size={21} aria-hidden="true" />
          <p>
            Built for understanding, not trading. Lessons explain concepts using
            educational and primary sources.
          </p>
          <Link to="/about#methodology">
            Our methodology <ArrowUpRight size={16} aria-hidden="true" />
          </Link>
        </aside>
      )}
    </div>
  );
}

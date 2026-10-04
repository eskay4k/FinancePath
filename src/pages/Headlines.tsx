import { useState } from "react";
import { Link } from "react-router-dom";
import { ArrowRight, RefreshCw, CalendarDays, Newspaper } from "lucide-react";
import { MarketOverview } from "../components/MarketOverview";
import { useNews } from "../useNews";
import { useProgress } from "../useProgress";
import { dayKey } from "../activity";
import { LevelSelector } from "../components/LevelSelector";
import { useMetadata } from "../useMetadata";
export function Headlines() {
  useMetadata(
    "Today’s financial headlines",
    "Real financial news with reading guides for your level. Browse by day and learn the terms behind the headlines.",
  );
  const { progress, setProgress } = useProgress();
  const { data, loading, reload } = useNews();
  const level = progress.selectedLevel ?? "Beginner";
  const today = dayKey();
  const [date, setDate] = useState(today),
    [topic, setTopic] = useState(""),
    [source, setSource] = useState("");
  const available = (data?.articles ?? []).filter(
    (a) => dayKey(new Date(a.publishedAt)) <= date,
  );
  const daily = available.filter(
    (a) => dayKey(new Date(a.publishedAt)) === date,
  );
  // Interleave publishers so a high-volume feed does not dominate the first screen.
  const candidates = daily.length ? daily : available;
  const groups = [...new Set(candidates.map((a) => a.source))].map((source) =>
    candidates.filter((a) => a.source === source),
  );
  const balanced = Array.from(
    { length: Math.max(0, ...groups.map((g) => g.length)) },
    (_, i) => groups.flatMap((g) => (g[i] ? [g[i]] : [])),
  ).flat();
  const selected = daily.length ? balanced : balanced.slice(0, 8);
  const shown = selected.filter(
    (a) => (!topic || a.topic === topic) && (!source || a.source === source),
  );
  return (
    <div className="container page headlines-page">
      <div className="news-heading">
        <div>
          <h1 tabIndex={-1}>The world, a little clearer.</h1>
          <p>Real financial stories. A reading guide at your level.</p>
        </div>
        <button
          className="button secondary"
          disabled={loading}
          onClick={reload}
        >
          <RefreshCw size={17} aria-hidden="true" />
          {loading ? "Checking…" : "Refresh news"}
        </button>
      </div>
      <div className="news-controls">
        <div>
          <label htmlFor="news-date">
            <CalendarDays size={18} aria-hidden="true" />
            Browse a day
          </label>
          <input
            id="news-date"
            type="date"
            max={today}
            value={date}
            onChange={(e) => {
              if (e.target.value && e.target.value <= today) {
                setDate(e.target.value);
                setTopic("");
                setSource("");
              }
            }}
          />
        </div>
        <div className="news-level">
          <span>Reading level</span>
          <LevelSelector
            value={level}
            onChange={(selectedLevel) =>
              setProgress((p) => ({ ...p, selectedLevel }))
            }
            label="News reading level"
          />
        </div>
      </div>
      <div className="feed-status" role="status">
        {loading && !data
          ? "Checking publishers for the latest stories…"
          : data?.status === "fallback"
            ? "Live news is unavailable. Showing a dated, verified backup collection."
            : data?.status === "cached"
              ? "News could not refresh. Showing the last available collection."
              : data?.status === "partial"
                ? "Some publishers are unavailable. Available stories are shown."
                : `Automatically updated · Checked ${data ? new Date(data.fetchedAt).toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit" }) : ""}`}
      </div>
      <MarketOverview
        level={level}
        articles={data?.articles ?? []}
        date={date}
      />
      <div
        className="news-source-strip"
        aria-label="Publishers in this collection"
      >
        {[...new Set((data?.articles ?? []).map((a) => a.source))].map((s) => (
          <span key={s}>{s}</span>
        ))}
      </div>
      <div className="news-list-heading">
        <h2>
          {daily.length
            ? `Published ${date === today ? "today" : new Date(date + "T12:00:00").toLocaleDateString("en-US", { month: "short", day: "numeric" })}`
            : "Latest available stories"}
        </h2>
        <div className="news-filters">
          <label>
            Source
            <select value={source} onChange={(e) => setSource(e.target.value)}>
              <option value="">All sources</option>
              {[...new Set(selected.map((a) => a.source))].map((s) => (
                <option key={s}>{s}</option>
              ))}
            </select>
          </label>
          <label>
            Topic
            <select value={topic} onChange={(e) => setTopic(e.target.value)}>
              <option value="">All topics</option>
              {[...new Set(selected.map((a) => a.topic))].map((t) => (
                <option key={t}>{t}</option>
              ))}
            </select>
          </label>
        </div>
      </div>
      {!daily.length && data && (
        <p className="news-date-note">
          No stories from this collection were published on {date}. Showing the
          most recent available before that date. Publisher feeds provide a
          rolling collection, not a complete archive.
        </p>
      )}
      <div className="news-grid">
        {shown.map((a) => (
          <article className="news-card" key={a.id}>
            <span className="news-card-topic">
              <Newspaper size={18} aria-hidden="true" />
              {a.topic}
            </span>
            <h3>
              <a href={a.url} target="_blank" rel="noopener noreferrer">
                {a.title}
              </a>
            </h3>
            {a.excerpt && <p>{a.excerpt}</p>}
            <div className="news-card-meta">
              <span>{a.source}</span>
              <time dateTime={a.publishedAt}>
                {new Date(a.publishedAt).toLocaleDateString("en-US", {
                  month: "short",
                  day: "numeric",
                })}
              </time>
            </div>
            <Link className="news-card-action" to={`/headlines/${a.id}`}>
              Read with {level.toLowerCase()} guidance{" "}
              <ArrowRight size={17} aria-hidden="true" />
            </Link>
          </article>
        ))}
      </div>
      {data && !shown.length && (
        <div className="empty-state">
          <h2>No stories for this selection.</h2>
          <p>
            Try a recent date or another topic. Older stories may have left the
            publisher’s feed.
          </p>
          <button
            className="button secondary"
            onClick={() => {
              setDate(today);
              setTopic("");
              setSource("");
            }}
          >
            Back to today
          </button>
        </div>
      )}
      <div className="news-learning-link">
        <p>Want to understand a concept first?</p>
        <Link className="text-link" to="/decoder">
          Explore headline practice lessons{" "}
          <ArrowRight size={17} aria-hidden="true" />
        </Link>
      </div>
    </div>
  );
}

import { useEffect } from "react";
import { Link, useParams } from "react-router-dom";
import { ArrowLeft, ExternalLink, Check } from "lucide-react";
import { useNews } from "../useNews";
import { useProgress } from "../useProgress";
import { readingGuide } from "../data/news";
import { dayKey } from "../activity";
import { finishArticle } from "../progress";
import { LevelSelector } from "../components/LevelSelector";
import { WordReader } from "../components/WordReader";
import { CompanionArt } from "../components/Companion";
import { companions } from "../data/companions";
import { useMetadata } from "../useMetadata";
export function NewsArticle() {
  const { id } = useParams();
  const { data, loading, reload } = useNews();
  const { progress, setProgress } = useProgress();
  const level = progress.selectedLevel ?? "Beginner";
  const article = data?.articles.find((a) => a.id === id);
  useMetadata(
    article?.title ?? "Read the news",
    "A sourced financial story with level-specific reading support.",
  );
  useEffect(() => {
    if (article?.id)
      document
        .querySelector<HTMLElement>("main h1")
        ?.focus({ preventScroll: true });
  }, [article?.id]);
  if (!article)
    return (
      <div className="container page">
        <Link className="back-link" to="/headlines">
          Back to headlines
        </Link>
        <h1 tabIndex={-1}>
          {loading
            ? "Finding your story…"
            : "This story is no longer in the feed."}
        </h1>
        {!loading && (
          <>
            <p>
              Publisher feeds rotate. Explore the current headlines, or try
              refreshing.
            </p>
            <button className="button secondary" onClick={reload}>
              Try again
            </button>
          </>
        )}
      </div>
    );
  const paragraphs = readingGuide(article, level);
  const readToday =
    progress.readArticles[article.id] &&
    dayKey(new Date(progress.readArticles[article.id])) === dayKey();
  return (
    <div className="container page news-article-page">
      <Link className="back-link" to="/headlines">
        <ArrowLeft size={17} aria-hidden="true" />
        Back to headlines
      </Link>
      <div className="news-article-layout">
        <article>
          <div className="lesson-meta">
            <span className="topic-tag">{article.topic}</span>
            <span>{article.source}</span>
            <time dateTime={article.publishedAt}>
              {new Date(article.publishedAt).toLocaleDateString("en-US", {
                month: "long",
                day: "numeric",
                year: "numeric",
              })}
            </time>
          </div>
          <h1 tabIndex={-1}>{article.title}</h1>
          {data?.status === "fallback" && (
            <p className="feed-status">
              This is a verified backup story, not a live update.
            </p>
          )}
          <div className="article-level-bar">
            <span>Your reading level</span>
            <LevelSelector
              value={level}
              onChange={(selectedLevel) =>
                setProgress((p) => ({ ...p, selectedLevel }))
              }
              label="Article reading level"
            />
          </div>
          <section className="reading-guide">
            <WordReader
              key={level}
              paragraphs={paragraphs}
              excerpt={article.excerpt}
              source={article.source}
              heading={
                level === "Beginner"
                  ? "Let’s unpack it"
                  : level === "Intermediate"
                    ? "Connect the ideas"
                    : "Analytical reading guide"
              }
            />
            <p className="guide-disclosure">
              FinancePath reading guidance explains the concepts around this
              story. It does not replace the publisher’s reporting.
            </p>
          </section>
          <a
            className="button secondary original-article"
            href={article.url}
            target="_blank"
            rel="noopener noreferrer"
          >
            Read the full article at {article.source}
            <ExternalLink size={17} aria-hidden="true" />
          </a>
          <section className="article-completion">
            <h2>
              {readToday
                ? "Today’s reading, done."
                : "One story. One learning step."}
            </h2>
            <p>
              {readToday
                ? "This article counts toward today’s learning streak."
                : "When you’ve finished reading, mark this article read to count today toward your streak."}
            </p>
            <button
              className={`button ${readToday ? "secondary" : "primary"}`}
              disabled={!!readToday}
              onClick={() => setProgress((p) => finishArticle(p, article.id))}
            >
              <Check size={18} aria-hidden="true" />
              {readToday ? "Read today" : "Mark article read"}
            </button>
            <span className="sr-only" role="status">
              {readToday
                ? "Article marked read. Your learning streak has been updated."
                : ""}
            </span>
          </section>
        </article>
        <aside className="article-guide-card">
          <CompanionArt level={level} />
          <h2>{companions[level].name}’s reading prompt</h2>
          <p aria-live="polite">
            {readToday
              ? level === "Beginner"
                ? "You did it! Another little step toward understanding money."
                : level === "Intermediate"
                  ? "Reading complete. Keep connecting these stories to the concepts you know."
                  : "Reading recorded. Consider which evidence would change your interpretation."
              : companions[level].tips[0]}
          </p>
          <Link className="text-link" to="/dashboard">
            Back to your dashboard
          </Link>
        </aside>
      </div>
    </div>
  );
}

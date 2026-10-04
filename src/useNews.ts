import { useEffect, useState, useCallback } from "react";
import { fallbackNews, type NewsResponse } from "./data/news";
const validResponse = (value: unknown): value is NewsResponse => {
  if (typeof value !== "object" || value === null) return false;
  const data = value as Partial<NewsResponse>;
  return (
    Array.isArray(data.articles) &&
    typeof data.fetchedAt === "string" &&
    ["live", "partial", "cached", "fallback"].includes(data.status ?? "") &&
    data.articles.every(
      (a) =>
        a &&
        typeof a.id === "string" &&
        typeof a.title === "string" &&
        typeof a.excerpt === "string" &&
        typeof a.topic === "string" &&
        typeof a.source === "string" &&
        typeof a.url === "string" &&
        a.url.startsWith("https://") &&
        !Number.isNaN(Date.parse(a.publishedAt)),
    )
  );
};
export function useNews() {
  const [data, setData] = useState<NewsResponse | null>(null),
    [loading, setLoading] = useState(true),
    [refresh, setRefresh] = useState(0);
  useEffect(() => {
    const controller = new AbortController();
    const load = async () => {
      try {
        const res = await fetch("/api/news", { signal: controller.signal });
        if (!res.ok) throw new Error("Unavailable");
        const value: unknown = await res.json();
        if (!validResponse(value)) throw new Error("Invalid news");
        setData(value);
      } catch {
        if (!controller.signal.aborted)
          setData((old) =>
            old
              ? { ...old, status: "cached" }
              : {
                  articles: fallbackNews,
                  status: "fallback",
                  fetchedAt: "2026-10-03T19:00:00Z",
                  unavailableSources: [],
                },
          );
      } finally {
        if (!controller.signal.aborted) setLoading(false);
      }
    };
    const timer = setTimeout(() => {
      setLoading(true);
      void load();
    }, 0);
    const interval = setInterval(() => void load(), 15 * 60 * 1000);
    return () => {
      controller.abort();
      clearTimeout(timer);
      clearInterval(interval);
    };
  }, [refresh]);
  const reload = useCallback(() => setRefresh((r) => r + 1), []);
  return { data, loading, reload };
}

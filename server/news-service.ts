import { createHash } from "node:crypto";
import { XMLParser, XMLValidator } from "fast-xml-parser";
import {
  fallbackNews,
  inferTopic,
  type NewsArticle,
  type NewsResponse,
} from "../src/data/news";
export const feeds = [
  {
    name: "BBC News",
    url: "https://feeds.bbci.co.uk/news/business/rss.xml",
    hosts: ["www.bbc.co.uk", "www.bbc.com", "bbc.co.uk", "bbc.com"],
    publicDomain: false,
  },
  {
    name: "CNBC",
    url: "https://www.cnbc.com/id/100003114/device/rss/rss.html",
    hosts: ["www.cnbc.com", "cnbc.com"],
    publicDomain: false,
  },
  {
    name: "NPR",
    url: "https://feeds.npr.org/1006/rss.xml",
    hosts: ["www.npr.org", "npr.org"],
    publicDomain: false,
  },
  {
    name: "The New York Times",
    url: "https://rss.nytimes.com/services/xml/rss/nyt/Business.xml",
    hosts: ["www.nytimes.com", "nytimes.com"],
    publicDomain: false,
  },
  {
    name: "Federal Reserve",
    url: "https://www.federalreserve.gov/feeds/press_monetary.xml",
    hosts: ["www.federalreserve.gov"],
    publicDomain: true,
  },
];
type Feed = (typeof feeds)[number];
const object = (value: unknown): value is Record<string, unknown> =>
  typeof value === "object" && value !== null && !Array.isArray(value);
const plain = (value: unknown) =>
  typeof value === "string"
    ? value
        .replace(/<script\b[^>]*>[\s\S]*?<\/script>/gi, "")
        .replace(/<[^>]*>/g, " ")
        .replace(/&nbsp;/g, " ")
        .replace(/&amp;/g, "&")
        .replace(/&quot;/g, '"')
        .replace(/&#39;/g, "'")
        .replace(/\s+/g, " ")
        .trim()
    : "";
export function parseFeed(
  xml: string,
  feed: Feed,
  now = new Date(),
): NewsArticle[] {
  if (
    xml.length > 2_000_000 ||
    /<!DOCTYPE|<!ENTITY/i.test(xml) ||
    XMLValidator.validate(xml) !== true
  )
    return [];
  const parsed: unknown = new XMLParser({
    ignoreAttributes: true,
    processEntities: true,
  }).parse(xml);
  if (!object(parsed) || !object(parsed.rss) || !object(parsed.rss.channel))
    return [];
  const raw = parsed.rss.channel.item;
  const items = Array.isArray(raw) ? raw : [raw];
  return items.flatMap((item: unknown) => {
    if (!object(item)) return [];
    const title = plain(item.title)
        .slice(0, 250)
        .split(/\s+/)
        .slice(0, feed.publicDomain ? 40 : 25)
        .join(" "),
      description = plain(item.description);
    if (
      !title ||
      typeof item.link !== "string" ||
      typeof item.pubDate !== "string"
    )
      return [];
    const published = new Date(item.pubDate);
    if (Number.isNaN(published.getTime()) || published > now) return [];
    let url: URL;
    try {
      url = new URL(item.link);
    } catch {
      return [];
    }
    if (
      url.protocol !== "https:" ||
      !feed.hosts.includes(url.hostname) ||
      url.username ||
      url.password
    )
      return [];
    url.search = "";
    url.hash = "";
    // Keep licensed publisher material as a short feed excerpt; full reporting stays at its source.
    const maxWords = feed.publicDomain
      ? 70
      : Math.max(0, 25 - title.split(/\s+/).length);
    const words = description.split(/\s+/).filter(Boolean);
    const excerpt =
      words.length > maxWords
        ? words.slice(0, maxWords).join(" ") + "…"
        : description;
    return [
      {
        id: `news-${createHash("sha256").update(url.href).digest("hex").slice(0, 24)}`,
        title,
        source: feed.name,
        url: url.href,
        publishedAt: published.toISOString(),
        excerpt: maxWords ? excerpt : "",
        topic: inferTopic(title),
      },
    ];
  });
}
let cache: { data: NewsResponse; time: number } | null = null;
let pending: Promise<NewsResponse> | null = null;
export async function getNews(
  now = new Date(),
  fetcher: typeof fetch = fetch,
): Promise<NewsResponse> {
  if (cache && now.getTime() - cache.time < 15 * 60 * 1000) return cache.data;
  if (pending) return pending;
  pending = (async () => {
    const results = await Promise.allSettled(
      feeds.map(async (feed) => {
        const response = await fetcher(feed.url, {
          signal: AbortSignal.timeout(7000),
          headers: { Accept: "application/rss+xml, application/xml, text/xml" },
        });
        if (!response.ok) throw new Error("Feed unavailable");
        const items = parseFeed(await response.text(), feed, now);
        if (!items.length) throw new Error("No valid items");
        return items;
      }),
    );
    const articles: NewsArticle[] = [];
    const unavailableSources: string[] = [];
    results.forEach((r, i) => {
      if (r.status === "fulfilled") articles.push(...r.value);
      else unavailableSources.push(feeds[i].name);
    });
    if (!articles.length && cache)
      return { ...cache.data, status: "cached" as const, unavailableSources };
    const sourceCounts = new Map<string, number>();
    const data: NewsResponse = {
      articles: articles.length
        ? [...new Map(articles.map((a) => [a.url, a])).values()]
            .sort((a, b) => b.publishedAt.localeCompare(a.publishedAt))
            .filter((a) => {
              const count = sourceCounts.get(a.source) ?? 0;
              sourceCounts.set(a.source, count + 1);
              return count < 12;
            })
            .slice(0, 60)
        : fallbackNews.filter((a) => new Date(a.publishedAt) <= now),
      fetchedAt: now.toISOString(),
      status: articles.length
        ? unavailableSources.length
          ? "partial"
          : "live"
        : "fallback",
      unavailableSources,
    };
    if (articles.length) cache = { data, time: now.getTime() };
    return data;
  })();
  try {
    return await pending;
  } finally {
    pending = null;
  }
}

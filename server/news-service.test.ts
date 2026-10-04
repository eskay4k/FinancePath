import { describe, expect, it, vi } from "vitest";
import { feeds, parseFeed } from "./news-service";
const date = new Date("2026-10-03T20:00:00Z");
function feed(
  title = "Oil prices change",
  link = "https://www.bbc.co.uk/news/articles/example",
  pubDate = "Sat, 03 Oct 2026 08:00:00 GMT",
  description = "A published summary of a real event.",
) {
  return `<rss><channel><item><title><![CDATA[${title}]]></title><link>${link}</link><pubDate>${pubDate}</pubDate><description><![CDATA[${description}]]></description></item></channel></rss>`;
}
describe("publisher feed validation", () => {
  it("parses single-item RSS and strips source tracking parameters", () => {
    const items = parseFeed(
      feed(
        "Oil prices change",
        "https://www.bbc.co.uk/news/articles/example?tracking=1",
      ),
      feeds[0],
      date,
    );
    expect(items).toHaveLength(1);
    expect(items[0].url).toBe("https://www.bbc.co.uk/news/articles/example");
    expect(items[0].topic).toBe("Prices & energy");
  });
  it("rejects unsafe hosts, protocols, malformed dates and future stories", () => {
    for (const link of [
      "javascript:alert(1)",
      "https://example.com/story",
      "https://www.bbc.co.uk.evil.example/story",
      "http://www.bbc.co.uk/story",
    ])
      expect(parseFeed(feed("Title", link), feeds[0], date)).toEqual([]);
    expect(
      parseFeed(feed("Title", undefined, "bad date"), feeds[0], date),
    ).toEqual([]);
    expect(
      parseFeed(
        feed("Title", undefined, "Sun, 04 Oct 2026 08:00:00 GMT"),
        feeds[0],
        date,
      ),
    ).toEqual([]);
  });
  it("does not execute HTML or accept XML entity expansion", () => {
    expect(
      parseFeed(
        feed(
          "Title",
          undefined,
          undefined,
          "<script>alert(1)</script><b>Plain text</b>",
        ),
        feeds[0],
        date,
      )[0].excerpt,
    ).toBe("Plain text");
    expect(
      parseFeed('<!DOCTYPE rss [<!ENTITY a "test">]><rss/>', feeds[0], date),
    ).toEqual([]);
    expect(parseFeed("<rss><broken>", feeds[0], date)).toEqual([]);
  });
  it("keeps publisher quotes within the short excerpt budget", () => {
    const item = parseFeed(
      feed(
        "A headline with several words",
        undefined,
        undefined,
        Array(60).fill("word").join(" "),
      ),
      feeds[0],
      date,
    )[0];
    expect(
      (item.title + " " + item.excerpt).split(/\s+/).length,
    ).toBeLessThanOrEqual(25);
  });
  it("deduplicates URLs, tolerates a failed publisher, and reports partial status", async () => {
    vi.resetModules();
    const { getNews } = await import("./news-service");
    const fetcher = vi
      .fn()
      .mockResolvedValueOnce(new Response(feed()))
      .mockRejectedValueOnce(new Error("offline"));
    const data = await getNews(date, fetcher);
    expect(data.status).toBe("partial");
    expect(data.articles).toHaveLength(1);
    expect(data.unavailableSources).toEqual(feeds.slice(1).map((f) => f.name));
  });
  it("uses a visibly labeled backup when every publisher is offline", async () => {
    vi.resetModules();
    const { getNews } = await import("./news-service");
    const data = await getNews(
      date,
      vi.fn().mockRejectedValue(new Error("offline")),
    );
    expect(data.status).toBe("fallback");
    expect(data.articles.length).toBeGreaterThan(0);
    expect(data.unavailableSources).toHaveLength(feeds.length);
  });
  it("retains the checked time of a stale collection on upstream failure", async () => {
    vi.resetModules();
    const { getNews } = await import("./news-service");
    const live = await getNews(
      date,
      vi.fn().mockResolvedValue(new Response(feed())),
    );
    const stale = await getNews(
      new Date("2026-10-03T21:00:00Z"),
      vi.fn().mockRejectedValue(new Error("offline")),
    );
    expect(stale.status).toBe("cached");
    expect(stale.fetchedAt).toBe(live.fetchedAt);
  });
});

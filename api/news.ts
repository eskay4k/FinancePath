import type { IncomingMessage, ServerResponse } from "node:http";
import { getNews } from "../server/news-service.js";
export default async function handler(
  request: IncomingMessage,
  response: ServerResponse,
) {
  if (request.method !== "GET") {
    response.writeHead(405, { Allow: "GET" });
    response.end();
    return;
  }
  try {
    const news = await getNews();
    response.writeHead(200, {
      "Content-Type": "application/json; charset=utf-8",
      "Cache-Control":
        news.status === "fallback"
          ? "no-store"
          : "public, s-maxage=900, stale-while-revalidate=3600",
      "X-Content-Type-Options": "nosniff",
    });
    response.end(JSON.stringify(news));
  } catch {
    response.writeHead(503, { "Content-Type": "application/json" });
    response.end(JSON.stringify({ error: "News temporarily unavailable" }));
  }
}

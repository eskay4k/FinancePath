import type { IncomingMessage, ServerResponse } from "node:http";
import { getDefinition, validWord } from "../server/definition-service.js";
export default async function handler(
  request: IncomingMessage,
  response: ServerResponse,
) {
  if (request.method !== "GET") {
    response.writeHead(405, { Allow: "GET" });
    response.end();
    return;
  }
  const word =
    new URL(request.url ?? "/", "http://localhost").searchParams.get("word") ??
    "";
  if (!validWord(word)) {
    response.writeHead(400, { "Content-Type": "application/json" });
    response.end(JSON.stringify({ error: "Choose one word" }));
    return;
  }
  try {
    const definition = await getDefinition(word);
    response.writeHead(definition ? 200 : 404, {
      "Content-Type": "application/json; charset=utf-8",
      "Cache-Control": definition ? "public, s-maxage=86400" : "no-store",
      "X-Content-Type-Options": "nosniff",
    });
    response.end(
      JSON.stringify(definition ?? { error: "Definition unavailable" }),
    );
  } catch {
    response.writeHead(503, { "Content-Type": "application/json" });
    response.end(JSON.stringify({ error: "Dictionary unavailable" }));
  }
}

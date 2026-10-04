export interface Definition {
  meaning: string;
  source: string;
  url: string;
  licenseUrl: string;
}
const cache = new Map<string, Definition>();
export function validWord(word: string) {
  return word.length <= 60 && /^\p{L}+(?:['’-]\p{L}+)*$/u.test(word);
}
export function extractDefinition(data: unknown): string | null {
  if (
    typeof data !== "object" ||
    data === null ||
    !("en" in data) ||
    !Array.isArray(data.en)
  )
    return null;
  for (const entry of data.en) {
    if (!entry || !Array.isArray(entry.definitions)) continue;
    for (const definition of entry.definitions) {
      if (typeof definition?.definition !== "string") continue;
      const text = definition.definition
        .replace(/<[^>]*>/g, "")
        .replace(/&nbsp;/g, " ")
        .replace(/&amp;/g, "&")
        .replace(/&quot;/g, '"')
        .replace(/&#39;/g, "'")
        .replace(/\s+/g, " ")
        .trim();
      if (text) return text.slice(0, 1400);
    }
  }
  return null;
}
export async function getDefinition(
  word: string,
  fetcher: typeof fetch = fetch,
): Promise<Definition | null> {
  if (!validWord(word)) return null;
  const key = word.toLowerCase();
  if (cache.has(key)) return cache.get(key)!;
  const response = await fetcher(
    `https://en.wiktionary.org/api/rest_v1/page/definition/${encodeURIComponent(key)}`,
    {
      signal: AbortSignal.timeout(6500),
      headers: {
        Accept: "application/json",
        "User-Agent": "FinancePath-MVP/1.0",
      },
    },
  );
  if (!response.ok) return null;
  const meaning = extractDefinition(await response.json());
  if (!meaning) return null;
  const result = {
    meaning,
    source: "Wiktionary",
    url: `https://en.wiktionary.org/wiki/${encodeURIComponent(key)}`,
    licenseUrl: "https://creativecommons.org/licenses/by-sa/4.0/",
  };
  if (cache.size >= 1000) cache.delete(cache.keys().next().value!);
  cache.set(key, result);
  return result;
}

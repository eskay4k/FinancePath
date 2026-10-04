import { describe, expect, it, vi } from "vitest";
import {
  extractDefinition,
  getDefinition,
  validWord,
} from "./definition-service";
describe("dictionary proxy", () => {
  it("accepts a word and rejects arbitrary URLs or oversized input", () => {
    expect(validWord("winter")).toBe(true);
    expect(validWord("long-term")).toBe(true);
    expect(validWord("https://example.com")).toBe(false);
    expect(validWord("two words")).toBe(false);
    expect(validWord("a".repeat(61))).toBe(false);
  });
  it("uses the first nonempty English definition without HTML", () => {
    expect(
      extractDefinition({
        en: [
          {
            definitions: [
              { definition: "" },
              {
                definition:
                  'The <a href="/wiki/season">season</a> &amp; its weather.',
              },
            ],
          },
        ],
      }),
    ).toBe("The season & its weather.");
    expect(extractDefinition({ fr: [] })).toBeNull();
  });
  it("attributes definitions and encodes the exact lookup word", async () => {
    const fetcher = vi
      .fn()
      .mockResolvedValue(
        new Response(
          JSON.stringify({
            en: [{ definitions: [{ definition: "A season." }] }],
          }),
        ),
      );
    const result = await getDefinition("winter", fetcher);
    expect(fetcher.mock.calls[0][0]).toBe(
      "https://en.wiktionary.org/api/rest_v1/page/definition/winter",
    );
    expect(result?.source).toBe("Wiktionary");
    expect(result?.licenseUrl).toContain("by-sa/4.0");
  });
  it("does not request arbitrary destinations or fabricate missing definitions", async () => {
    const fetcher = vi
      .fn()
      .mockResolvedValue(new Response("", { status: 404 }));
    expect(await getDefinition("http://evil.example", fetcher)).toBeNull();
    expect(fetcher).not.toHaveBeenCalled();
    expect(await getDefinition("unrecognizedword", fetcher)).toBeNull();
  });
});

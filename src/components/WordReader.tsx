import { useEffect, useRef, useState } from "react";
import { BookOpen, X } from "lucide-react";
import { lessons } from "../data/lessons";
const glossary: Record<string, string> = {
  ...Object.fromEntries(
    lessons.flatMap((l) =>
      l.terms.map((t) => [t.term.toLowerCase(), t.definition]),
    ),
  ),
  rates:
    "Percentages used to describe the cost of borrowing or a return on savings.",
  rate: "A quantity measured relative to another quantity; an interest rate expresses borrowing cost or savings earnings as a percentage.",
  interest: "Money paid for borrowing, or earned by saving or lending.",
  stocks: "Shares of ownership in companies.",
  stock: "A share of ownership in a company.",
  jobs: "Paid work positions. A jobs report often measures the net change in the number of positions.",
  payroll:
    "The employees on an employer’s pay records; payroll employment counts jobs rather than unique people.",
  gdp: "Gross domestic product: the value of final goods and services produced within a country.",
  annualized: "Expressed as if the measured pace continued for a full year.",
  basis:
    "In “basis points,” one basis point is one-hundredth of a percentage point.",
  fomc: "Federal Open Market Committee: the Federal Reserve committee that sets U.S. monetary policy.",
  energy:
    "Power used for activities such as transport, heating, and electricity generation.",
  supply:
    "The amount of a good or service producers are willing and able to offer.",
  demand: "The amount people are willing and able to buy at different prices.",
  exports: "Goods and services sold to buyers in other countries.",
  imports: "Goods and services bought from other countries.",
  unemployment:
    "Being without work while available for work and actively seeking it, under the usual U.S. statistical definition.",
  barrel:
    "A unit used to measure oil; a standard petroleum barrel contains 42 U.S. gallons.",
  barrels:
    "Units used to measure oil; one petroleum barrel contains 42 U.S. gallons.",
  diesel:
    "A fuel commonly used in trucks, some cars, and industrial equipment.",
  inflation: "A broad increase in prices over time.",
};
type Definition = {
  meaning: string;
  source: string;
  url?: string;
  licenseUrl?: string;
};
const cache = new Map<string, Definition>();
export function WordReader({
  paragraphs,
  excerpt,
  source,
  heading,
}: {
  paragraphs: string[];
  excerpt?: string;
  source?: string;
  heading?: string;
}) {
  const [enabled, setEnabled] = useState(false),
    [selected, setSelected] = useState(""),
    [definition, setDefinition] = useState<Definition | null>(null),
    [busy, setBusy] = useState(false);
  const controller = useRef<AbortController | null>(null),
    trigger = useRef<HTMLButtonElement | null>(null),
    panel = useRef<HTMLDivElement>(null);
  const dismiss = () => {
    controller.current?.abort();
    controller.current = null;
    setSelected("");
    setDefinition(null);
    trigger.current?.focus({ preventScroll: true });
  };
  useEffect(() => () => controller.current?.abort(), []);
  useEffect(() => {
    if (!selected) return;
    const escape = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        controller.current?.abort();
        controller.current = null;
        setSelected("");
        setDefinition(null);
        trigger.current?.focus({ preventScroll: true });
      }
    };
    document.addEventListener("keydown", escape);
    return () => document.removeEventListener("keydown", escape);
  }, [selected]);
  async function lookup(raw: string, button: HTMLButtonElement) {
    if (window.getSelection()?.toString()) return;
    controller.current?.abort();
    controller.current = null;
    const word = raw.toLowerCase().replace(/[’']/g, "'");
    trigger.current = button;
    setSelected(raw);
    setBusy(false);
    requestAnimationFrame(() => panel.current?.focus({ preventScroll: true }));
    if (glossary[word]) {
      setDefinition({
        meaning: glossary[word],
        source: "FinancePath glossary",
      });
      return;
    }
    if (cache.has(word)) {
      setDefinition(cache.get(word)!);
      return;
    }
    setDefinition(null);
    setBusy(true);
    const request = new AbortController();
    controller.current = request;
    const timeout = setTimeout(() => request.abort(), 7000);
    try {
      const response = await fetch(
        `/api/definition?word=${encodeURIComponent(word)}`,
        { signal: request.signal },
      );
      if (!response.ok) throw new Error("Not found");
      const data = await response.json();
      const meaning = data?.meaning;
      if (typeof meaning !== "string") throw new Error("Not found");
      const result = {
        meaning,
        source: "Wiktionary",
        url: `https://en.wiktionary.org/wiki/${encodeURIComponent(word)}`,
        licenseUrl: "https://creativecommons.org/licenses/by-sa/4.0/",
      };
      if (cache.size >= 100) cache.delete(cache.keys().next().value!);
      cache.set(word, result);
      if (controller.current === request && !request.signal.aborted)
        setDefinition(result);
    } catch {
      if (controller.current === request)
        setDefinition({
          meaning:
            "No definition is available right now. Try a different word or check the article’s original source.",
          source: "Word help",
        });
    } finally {
      clearTimeout(timeout);
      if (controller.current === request) setBusy(false);
    }
  }
  const renderWords = (p: string) =>
    enabled
      ? p.split(/(\p{L}+(?:[’'-]\p{L}+)*)/u).map((part, j) =>
          /^\p{L}/u.test(part) ? (
            <button
              className="word-token"
              key={j}
              aria-label={`Define ${part}`}
              onClick={(e) => void lookup(part, e.currentTarget)}
            >
              {part}
            </button>
          ) : (
            part
          ),
        )
      : p;
  return (
    <div className="word-reader">
      <div className="word-help-toolbar">
        <button
          className={`word-help-toggle ${enabled ? "on" : ""}`}
          aria-pressed={enabled}
          onClick={() => {
            setEnabled(!enabled);
            dismiss();
          }}
        >
          <BookOpen size={18} aria-hidden="true" />
          Word help: {enabled ? "on" : "off"}
        </button>
        <span>
          {enabled
            ? "Click a word for its meaning. Escape closes it."
            : "Turn on only when you want word definitions."}
        </span>
      </div>
      {excerpt && (
        <blockquote className="publisher-excerpt">
          <p>{renderWords(excerpt)}</p>
          <cite>From {source}’s published summary</cite>
        </blockquote>
      )}
      {heading && <h2>{heading}</h2>}
      <div
        className={
          enabled ? "article-prose word-help-enabled" : "article-prose"
        }
      >
        {paragraphs.map((p, i) => (
          <p key={i}>{renderWords(p)}</p>
        ))}
      </div>
      {enabled && selected && (
        <div
          className="word-definition"
          ref={panel}
          tabIndex={-1}
          role="region"
          aria-label={`Definition for ${selected}`}
        >
          <div>
            <strong>{selected}</strong>
            <button aria-label="Close definition" onClick={dismiss}>
              <X size={18} />
            </button>
          </div>
          <p aria-live="polite">
            {busy ? "Looking up this word…" : definition?.meaning}
          </p>
          {definition?.url ? (
            <span className="definition-credit">
              <a
                href={definition.url}
                target="_blank"
                rel="noopener noreferrer"
              >
                {definition.source}
              </a>
              {definition.licenseUrl && (
                <>
                  {" "}
                  ·{" "}
                  <a
                    href={definition.licenseUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    CC BY-SA 4.0
                  </a>
                </>
              )}
            </span>
          ) : (
            <span>{definition?.source}</span>
          )}
        </div>
      )}
    </div>
  );
}

import type { Level } from "./types";

interface MarketLesson {
  title: string;
  intro: string;
  caption: string;
  steps: { title: string; text: string }[];
  example: { label: string; text: string };
  question: string;
  choices: string[];
  correct: number;
  feedback: string;
  contextTitle: string;
}

export const marketLessons: Record<Level, MarketLesson> = {
  Beginner: {
    title: "Let’s read your first market chart",
    intro:
      "Start with US 500 and 1D. You only need to notice the change, the time period, and what the chart represents.",
    caption:
      "These charts are market indicators that follow groups of U.S. companies. They use a separate product called a CFD, so they can differ from the official stock-market scores. You do not need to buy anything to learn from them.",
    steps: [
      {
        title: "Look for the plus or minus",
        text: "A plus (+) means the price rose over the selected period. A minus (−) means it fell. Read the sign as well as the color. A rising market indicator does not mean every company rose.",
      },
      {
        title: "Check how much, and over how long",
        text: "The percentage tells you the size of the change. 1D means one day; 1M means one month. The big price number is the indicator’s quoted value, not the amount you need to invest. If the market is closed, you are seeing its latest available session.",
      },
      {
        title: "Connect it to everyday life",
        text: "Companies earn money by selling things. Changes in borrowing costs, prices, or shopping can affect what people expect companies to earn. A news story may help explain those expectations, but it does not prove why this chart moved.",
      },
    ],
    example: {
      label: "Imagine this: +1% over 1D",
      text: "If an indicator started at 100 and ended at 101, it rose 1%. That describes that period only. It does not mean it will rise tomorrow, or that your savings earned 1%. These numbers are a practice example, not today’s quotes.",
    },
    question: "A chart shows −2% with 1D selected. What does that tell you?",
    choices: [
      "The indicator fell 2% over that day",
      "Every company lost 2%",
      "It will fall again tomorrow",
    ],
    correct: 0,
    feedback:
      "−2% describes the indicator’s change for that day. It does not describe every company or predict the next day.",
    contextTitle: "What does this news have to do with money?",
  },
  Intermediate: {
    title: "Compare the move, then look for context",
    intro:
      "Use the same time range across all three tabs. Look for a broad move versus a difference between groups of companies.",
    caption:
      "US 500, US 30, and US Tech 100 are FOREX.com index-linked CFD series. They reference different company groups; Tech 100 is not the Nasdaq Composite. Provider prices and trading hours can differ from cash indexes.",
    steps: [
      {
        title: "Compare percentages on the same range",
        text: "Compare percentage changes rather than point changes: the indicators start at different values. Check the range and session on each tab before comparing. A five-day gain and a one-day gain answer different questions.",
      },
      {
        title: "Notice which group is leading",
        text: "US 500 references a broad group of large U.S. companies, US 30 a smaller group, and US Tech 100 a technology-heavy group. Different performance may reflect their different company mix. It does not establish how many individual stocks rose.",
      },
      {
        title: "Build a possible explanation",
        text: "Read the report’s event and timing. Higher borrowing costs can affect company spending and valuations; earnings news can change profit expectations. Compare the report with what was expected and look for supporting evidence before linking it to a price move.",
      },
    ],
    example: {
      label: "Practice comparison: US 500 +0.5%, Tech 100 +1.5%",
      text: "On an aligned one-day range, Tech 100 outperformed by 1 percentage point. That suggests a difference between these groups, not proof that technology news caused it. These are hypothetical returns, not current market data.",
    },
    question:
      "US 500 rises 1% over 1D and Tech 100 rises 3% over 1M. Can you say Tech 100 led today?",
    choices: [
      "Yes, because 3% is larger",
      "No, first align their time ranges",
      "Yes, because its index value is higher",
    ],
    correct: 1,
    feedback:
      "Align the periods first. Percentage returns are comparable only when their time windows and sessions are comparable.",
    contextTitle: "How might this affect companies and expectations?",
  },
  Advanced: {
    title: "Separate the observation from the thesis",
    intro:
      "Treat the CFD chart as one observation. Check measurement, composition, and event timing before making a market-wide inference.",
    caption:
      "FOREX.com CFD series are neither official cash-index observations nor total-return series. Account for provider basis, extended sessions, quote delays, and benchmark composition. US Tech 100 is not the Nasdaq Composite.",
    steps: [
      {
        title: "Establish a comparable measurement",
        text: "Align intervals, timestamps, session boundaries, and return definitions. CFD pricing can diverge from the underlying cash index. These price charts do not establish dividend-inclusive returns, and the article date filter does not set the chart’s session.",
      },
      {
        title: "Test composition and breadth",
        text: "The referenced S&P 500 and Nasdaq-100 use capitalization-based weighting, while the Dow is price-weighted. Concentration and sector exposure can produce divergent moves. Establish breadth separately with constituent-level or advance–decline data; these three series do not supply it.",
      },
      {
        title: "Evaluate an event hypothesis",
        text: "Compare a release with prior expectations, identify the first plausible transmission channel, and check prices before and after the event. Consider competing news and liquidity conditions. A matching headline and chart direction are insufficient to identify a causal effect.",
      },
    ],
    example: {
      label: "Hypothesis exercise: a rate surprise and a tech-led decline",
      text: "An unexpected rate increase could reprice discount-rate expectations and affect long-duration equity valuations. To assess that thesis, examine release timing, yield changes, sector returns, and competing events. The scenario is hypothetical; this widget does not provide that corroborating data.",
    },
    question:
      "All three CFD proxies rise. Which claim still requires separate evidence?",
    choices: [
      "Each displayed series rose over its selected range",
      "Most individual U.S. stocks rose",
      "The provider supplies CFD prices",
    ],
    correct: 1,
    feedback:
      "Positive index-linked returns do not establish constituent breadth. A small set of heavily weighted companies can drive an index higher.",
    contextTitle: "Which transmission channel and evidence would test this?",
  },
};

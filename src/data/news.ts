import type { Level } from "./types";
export interface NewsArticle {
  id: string;
  title: string;
  source: string;
  url: string;
  publishedAt: string;
  excerpt: string;
  topic: string;
  guides?: Record<Level, string[]>;
}
export interface NewsResponse {
  articles: NewsArticle[];
  fetchedAt: string;
  status: "live" | "partial" | "cached" | "fallback";
  unavailableSources: string[];
}
export const fallbackNews: NewsArticle[] = [
  {
    id: "bls-jobs-20261002",
    title: "U.S. hiring rises by 29,000 in September",
    source: "U.S. Bureau of Labor Statistics",
    url: "https://www.bls.gov/news.release/archives/empsit_10022026.htm",
    publishedAt: "2026-10-02T12:30:00Z",
    excerpt:
      "The September release reports 29,000 additional payroll jobs and a 4.2% unemployment rate.",
    topic: "Jobs",
    guides: {
      Beginner: [
        "The U.S. added 29,000 jobs in September. The unemployment rate was 4.2%. Think of these as two different snapshots: one tracks jobs, the other people looking for work.",
        "A small hiring gain does not mean nobody found a job. It is the balance of jobs added and jobs lost.",
      ],
      Intermediate: [
        "September payroll employment rose by 29,000, while unemployment stood at 4.2%. Payroll and unemployment figures come from different surveys, so they measure different parts of the labor market.",
        "Look at both hiring and labor-force participation before deciding what the report says about job opportunities.",
      ],
      Advanced: [
        "September nonfarm payrolls increased 29,000; the unemployment rate was 4.2%. Establishment and household survey estimates should be interpreted separately.",
        "Assess sample uncertainty, revisions, and participation alongside the headline. A single release cannot establish a labor-market trend.",
      ],
    },
  },
  {
    id: "bea-gdp-20260930",
    title: "U.S. economy grows at a 2.2% annual rate in Q2",
    source: "U.S. Bureau of Economic Analysis",
    url: "https://www.bea.gov/data/gdp/gross-domestic-product",
    publishedAt: "2026-09-30T12:30:00Z",
    excerpt:
      "The third estimate puts second-quarter real GDP growth at a 2.2% annual rate.",
    topic: "Economy",
    guides: {
      Beginner: [
        "The U.S. economy grew in April through June. The reported 2.2% figure is an annual rate, not the amount it grew in just those three months.",
        "GDP is a way to add up the goods and services a country produces. A bigger economy does not mean everyone’s finances improved.",
      ],
      Intermediate: [
        "Real GDP expanded at a 2.2% annualized rate in the second quarter. “Real” means the calculation adjusts for price changes.",
        "Consumer spending, investment, and exports contributed to growth. Separate the overall growth figure from the components before interpreting the result.",
      ],
      Advanced: [
        "The third estimate reports Q2 real GDP growth of 2.2% at an annual rate. This is an inflation-adjusted, annualized change rather than a year-over-year comparison.",
        "Examine contributions, revisions, and the mix of demand. Aggregate output growth alone does not measure distribution or household welfare.",
      ],
    },
  },
  {
    id: "fed-rates-20260916",
    title: "Federal Reserve raises its policy rate range",
    source: "Federal Reserve",
    url: "https://www.federalreserve.gov/newsevents/pressreleases/monetary20260916a.htm",
    publishedAt: "2026-09-16T18:00:00Z",
    excerpt:
      "The Fed raised its target range by a quarter percentage point to 3.75–4%.",
    topic: "Interest rates",
    guides: {
      Beginner: [
        "The Fed raised its key interest-rate range to 3.75–4%. The change was a quarter of a percentage point.",
        "Higher rates can make borrowing more expensive and slow spending. They do not make every price fall immediately.",
      ],
      Intermediate: [
        "The FOMC raised the federal funds target range by 25 basis points to 3.75–4%. A basis point is one-hundredth of a percentage point.",
        "Policy rates influence financial conditions, but the effect on loans, spending, and inflation arrives unevenly and with a lag.",
      ],
      Advanced: [
        "The FOMC increased its target range by 25 basis points to 3.75–4%. This is a policy target, not a uniform rate paid by borrowers.",
        "Consider the transmission through funding costs, expectations, and demand. Separate the announced action from uncertain future outcomes.",
      ],
    },
  },
];
const context: Record<string, Record<Level, string[]>> = {
  "Prices & energy": {
    Beginner: [
      "Energy is part of everyday costs: fuel, heating, and electricity. When reading this story, ask what might change the price people pay.",
      "Start with the named action and who is taking it. A proposal is not the same as something already happening.",
    ],
    Intermediate: [
      "Energy prices connect supply, demand, household bills, and business costs. Identify which part of that chain this story concerns.",
      "Separate the policy announcement from its eventual effect on prices. Contracts, taxes, and timing can change how costs reach consumers.",
    ],
    Advanced: [
      "Frame this report in terms of supply constraints, demand elasticity, and pass-through. The direction and magnitude of any effect require evidence beyond the headline.",
      "Distinguish announcements, implementation, and realized price effects. Consider time horizons and alternative explanations.",
    ],
  },
  Jobs: {
    Beginner: [
      "Jobs news can describe hiring, job losses, or people looking for work. Those are different measures.",
      "Read the dates carefully. A report published today may describe an earlier month.",
    ],
    Intermediate: [
      "Identify the survey and comparison period. Employment growth and the unemployment rate measure different things.",
      "Look for revisions and participation changes before inferring a trend. One report offers a snapshot.",
    ],
    Advanced: [
      "Check the reference period, sampling uncertainty, revisions, and seasonal adjustment. Distinguish establishment counts from household measures.",
      "Evaluate the report alongside participation, hours, and earnings where available. The headline alone cannot establish causality.",
    ],
  },
  "Interest rates": {
    Beginner: [
      "Interest is the cost of borrowing money. Central-bank decisions can influence that cost, but your own loan rate can be different.",
      "Watch for the difference between a decision already made and a prediction about the next one.",
    ],
    Intermediate: [
      "Distinguish the policy rate from market yields and retail borrowing costs. They are related but need not move together.",
      "A policy announcement affects expectations as well as current conditions. Its economic effects can take time.",
    ],
    Advanced: [
      "Separate the policy instrument, the expectations channel, and realized financial conditions. Evaluate the announcement against the available evidence.",
      "Consider lags and heterogeneous transmission before inferring effects on inflation or output.",
    ],
  },
  "Business & economy": {
    Beginner: [
      "This is a real report from the publisher linked below. First, identify who did what and when.",
      "Money stories often mix facts with expectations. Something that might happen is different from something already measured.",
    ],
    Intermediate: [
      "Identify the reported event, then distinguish observed outcomes from forecasts. Ask which comparison period the article uses.",
      "Connect the story to costs, revenue, demand, or policy only where the source provides evidence.",
    ],
    Advanced: [
      "Separate reporting from inference. Identify assumptions, data limitations, and the comparison baseline before assessing the implications.",
      "Evaluate alternative explanations and distributional effects. A headline does not, by itself, establish a causal relationship.",
    ],
  },
};
export function readingGuide(article: NewsArticle, level: Level) {
  return (
    article.guides?.[level] ??
    (context[article.topic] ?? context["Business & economy"])[level]
  );
}
export function inferTopic(title: string) {
  if (/inflation|energy|oil|diesel|gas|fuel|prices|bills/i.test(title))
    return "Prices & energy";
  if (/jobs|employment|payroll|labour|labor|hiring|wages/i.test(title))
    return "Jobs";
  if (/interest|rate|monetary|fomc/i.test(title)) return "Interest rates";
  return "Business & economy";
}

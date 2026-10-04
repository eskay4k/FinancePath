import type { Question, Level } from "./types";

export const assessmentQuestions: Question[] = [
  {
    id: "assessment-inflation",
    prompt:
      "If prices broadly rise while your income stays the same, what happens?",
    options: [
      "Your money buys more.",
      "Your money buys less.",
      "Your purchasing power stays the same.",
    ],
    correctIndex: 1,
    explanation: "Rising prices reduce what the same amount of money can buy.",
  },
  {
    id: "assessment-stock",
    prompt: "What is a stock?",
    options: [
      "An ownership share in a company.",
      "A guaranteed savings account.",
      "A tax on imported goods.",
    ],
    correctIndex: 0,
    explanation:
      "A stock represents ownership, with the possibility of gains and losses.",
  },
  {
    id: "assessment-interest",
    prompt: "What does an interest rate describe?",
    options: [
      "The total number of jobs.",
      "A company\u2019s total sales.",
      "The cost of borrowing or a rate earned on savings.",
    ],
    correctIndex: 2,
    explanation:
      "Interest is paid for borrowing or earned on some savings and lending arrangements.",
  },
  {
    id: "assessment-profit",
    prompt:
      "A business has $1,000 in revenue and $800 in costs. What is its simplified profit?",
    options: ["$1,800.", "$200.", "$1,000."],
    correctIndex: 1,
    explanation: "Revenue minus costs is $200 in this simplified example.",
  },
  {
    id: "assessment-bonds",
    prompt:
      "If market rates rise, what generally happens to existing fixed-rate bond prices?",
    options: [
      "They usually fall, all else equal.",
      "They are guaranteed to rise.",
      "They never change.",
    ],
    correctIndex: 0,
    explanation:
      "The older fixed payments become less attractive compared with higher-rate alternatives.",
  },
  {
    id: "assessment-policy",
    prompt: "Why can higher policy interest rates help reduce inflation?",
    options: [
      "They instantly lower every price.",
      "They make all borrowing free.",
      "They can reduce borrowing and spending.",
    ],
    correctIndex: 2,
    explanation:
      "Higher borrowing costs can restrain demand, with uncertain effects that take time.",
  },
];

export function recommendLevel(score: number): Level {
  if (score <= 2) return "Beginner";
  if (score <= 4) return "Intermediate";
  return "Advanced";
}

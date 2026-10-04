import type { Level } from "./types";
export const companions: Record<
  Level,
  { name: string; role: string; greeting: string; tips: string[] }
> = {
  Beginner: {
    name: "Pip",
    role: "Your curious little guide",
    greeting:
      "Hey! I’m Pip. We’ll figure out money together, one small step at a time.",
    tips: [
      "Start with one lesson. You don’t have to know the fancy words yet.",
      "Try Word help while reading the news. Click a word only when you want its meaning.",
      "A slower rise in prices still means prices are rising. That’s a useful difference!",
    ],
  },
  Intermediate: {
    name: "Finn",
    role: "Your connection finder",
    greeting:
      "I’m Finn. Let’s connect what you know to what’s happening in the world.",
    tips: [
      "Compare the headline with the source. Which number supports the main point?",
      "Think about the trade-off: who might benefit, and who might face a higher cost?",
      "Before drawing a conclusion, check whether a number is monthly or annual.",
    ],
  },
  Advanced: {
    name: "Sage",
    role: "Your analytical reading partner",
    greeting:
      "I’m Sage. Let’s examine the evidence, assumptions, and limits behind the story.",
    tips: [
      "Separate the reported observation from the causal explanation.",
      "Check revisions, seasonal adjustment, and the comparison period before interpreting a release.",
      "A relationship between two variables does not establish causation. Look for alternative explanations.",
    ],
  },
};

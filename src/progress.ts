import { dayKey, isDayKey } from "./activity";
import { assessmentQuestions } from "./data/assessment";
import { lessons } from "./data/lessons";
import { levels, type Level } from "./data/types";

export const STORAGE_KEY = "financepath.progress.v1";
export interface QuizResult {
  selectedIndex: number;
  lastCorrect: boolean;
  everCorrect: boolean;
}
export interface Progress {
  version: 1;
  selectedLevel: Level | null;
  completedLessons: Record<string, string>;
  quizResults: Record<string, QuizResult>;
  activityDays: string[];
  readArticles: Record<string, string>;
  assessment: {
    answers: Record<string, number>;
    score: number;
    completedAt: string;
  } | null;
}
export const freshProgress = (): Progress => ({
  version: 1,
  selectedLevel: null,
  completedLessons: {},
  quizResults: {},
  activityDays: [],
  readArticles: {},
  assessment: null,
});
const isObject = (value: unknown): value is Record<string, unknown> =>
  typeof value === "object" && value !== null && !Array.isArray(value);
export function parseProgress(raw: string | null): Progress {
  const clean = freshProgress();
  if (!raw) return clean;
  try {
    const data: unknown = JSON.parse(raw);
    if (!isObject(data) || data.version !== 1) return clean;
    if (levels.includes(data.selectedLevel as Level))
      clean.selectedLevel = data.selectedLevel as Level;
    if (isObject(data.completedLessons))
      for (const [id, date] of Object.entries(data.completedLessons)) {
        if (
          lessons.some((l) => l.id === id) &&
          typeof date === "string" &&
          !Number.isNaN(Date.parse(date))
        )
          clean.completedLessons[id] = date;
      }
    clean.activityDays = Array.isArray(data.activityDays)
      ? [...new Set(data.activityDays.filter(isDayKey))].sort()
      : [
          ...new Set(
            Object.values(clean.completedLessons).map((date) =>
              dayKey(new Date(date)),
            ),
          ),
        ].sort();
    if (isObject(data.readArticles))
      for (const [id, date] of Object.entries(data.readArticles)) {
        if (
          /^[a-zA-Z0-9_-]{1,180}$/.test(id) &&
          typeof date === "string" &&
          !Number.isNaN(Date.parse(date))
        )
          clean.readArticles[id] = date;
      }
    if (isObject(data.quizResults))
      for (const [id, result] of Object.entries(data.quizResults)) {
        const question = lessons.find((l) => l.quiz.id === id)?.quiz;
        if (
          question &&
          isObject(result) &&
          Number.isInteger(result.selectedIndex) &&
          (result.selectedIndex as number) >= 0 &&
          (result.selectedIndex as number) < question.options.length &&
          typeof result.everCorrect === "boolean"
        ) {
          const selectedIndex = result.selectedIndex as number;
          const lastCorrect = selectedIndex === question.correctIndex;
          clean.quizResults[id] = {
            selectedIndex,
            lastCorrect,
            everCorrect: result.everCorrect || lastCorrect,
          };
        }
      }
    if (
      isObject(data.assessment) &&
      isObject(data.assessment.answers) &&
      Number.isInteger(data.assessment.score) &&
      (data.assessment.score as number) >= 0 &&
      (data.assessment.score as number) <= 6 &&
      typeof data.assessment.completedAt === "string" &&
      !Number.isNaN(Date.parse(data.assessment.completedAt))
    ) {
      clean.assessment = {
        answers: Object.fromEntries(
          Object.entries(data.assessment.answers).filter(([id, v]) =>
            assessmentQuestions.some(
              (q) =>
                q.id === id &&
                Number.isInteger(v) &&
                (v as number) >= 0 &&
                (v as number) < q.options.length,
            ),
          ),
        ) as Record<string, number>,
        score: data.assessment.score as number,
        completedAt: data.assessment.completedAt,
      };
    }
  } catch {
    /* Invalid or unsupported records safely become clean state. */
  }
  return clean;
}
export function completeLesson(
  state: Progress,
  id: string,
  now = new Date().toISOString(),
): Progress {
  if (!lessons.some((l) => l.id === id)) return state;
  if (state.completedLessons[id])
    return recordActivity(state, dayKey(new Date(now)));
  return {
    ...state,
    completedLessons: { ...state.completedLessons, [id]: now },
    activityDays: [
      ...new Set([...state.activityDays, dayKey(new Date(now))]),
    ].sort(),
  };
}
export function answerQuestion(
  state: Progress,
  id: string,
  selectedIndex: number,
): Progress {
  const question = lessons.find((l) => l.quiz.id === id)?.quiz;
  if (
    !question ||
    !Number.isInteger(selectedIndex) ||
    selectedIndex < 0 ||
    selectedIndex >= question.options.length
  )
    return state;
  const lastCorrect = selectedIndex === question.correctIndex;
  return {
    ...state,
    activityDays: [...new Set([...state.activityDays, dayKey()])].sort(),
    quizResults: {
      ...state.quizResults,
      [id]: {
        selectedIndex,
        lastCorrect,
        everCorrect: state.quizResults[id]?.everCorrect === true || lastCorrect,
      },
    },
  };
}
export function resetProgress(state: Progress): Progress {
  return {
    ...state,
    completedLessons: {},
    quizResults: {},
    readArticles: {},
    activityDays: [],
  };
}
export function totals(state: Progress) {
  return {
    completed: Object.keys(state.completedLessons).length,
    correct: Object.values(state.quizResults).filter((r) => r.everCorrect)
      .length,
  };
}
export function loadProgress(): {
  progress: Progress;
  storageAvailable: boolean;
} {
  try {
    return {
      progress: parseProgress(localStorage.getItem(STORAGE_KEY)),
      storageAvailable: true,
    };
  } catch {
    return { progress: freshProgress(), storageAvailable: false };
  }
}
export function persistProgress(state: Progress): boolean {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    return true;
  } catch {
    return false;
  }
}

export function recordActivity(state: Progress, day = dayKey()): Progress {
  if (!isDayKey(day) || state.activityDays.includes(day)) return state;
  return { ...state, activityDays: [...state.activityDays, day].sort() };
}
export function finishArticle(
  state: Progress,
  id: string,
  now = new Date().toISOString(),
): Progress {
  if (!/^[a-zA-Z0-9_-]{1,180}$/.test(id) || Number.isNaN(Date.parse(now)))
    return state;
  return {
    ...recordActivity(state, dayKey(new Date(now))),
    readArticles: { ...state.readArticles, [id]: now },
  };
}

export function deleteSavedLearningData(
  storage: Pick<Storage, "removeItem">,
): boolean {
  try {
    storage.removeItem(STORAGE_KEY);
    storage.removeItem("financepath.profile.v1");
    return true;
  } catch {
    return false;
  }
}

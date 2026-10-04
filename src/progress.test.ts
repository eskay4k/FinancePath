import { describe, expect, it, vi, afterEach } from "vitest";
import {
  completeLesson,
  answerQuestion,
  freshProgress,
  parseProgress,
  resetProgress,
  totals,
  loadProgress,
  persistProgress,
} from "./progress";
import { recommendLevel, assessmentQuestions } from "./data/assessment";
import { lessons, decoderLessons, fundamentalLessons } from "./data/lessons";
describe("assessment scoring", () => {
  it.each([
    [0, "Beginner"],
    [2, "Beginner"],
    [3, "Intermediate"],
    [4, "Intermediate"],
    [5, "Advanced"],
    [6, "Advanced"],
  ])("maps score %i to %s", (score, level) =>
    expect(recommendLevel(score as number)).toBe(level),
  );
  it("has six unambiguous questions", () => {
    expect(assessmentQuestions).toHaveLength(6);
    assessmentQuestions.forEach((q) =>
      expect(q.options[q.correctIndex]).toBeTruthy(),
    );
  });
});
describe("progress invariants", () => {
  const lesson = lessons[0];
  it("counts a lesson only once and preserves the first completion time", () => {
    const state = completeLesson(
      freshProgress(),
      lesson.id,
      "2026-10-03T12:00:00Z",
    );
    const again = completeLesson(state, lesson.id, "2026-10-04T12:00:00Z");
    expect(totals(again).completed).toBe(1);
    expect(again.completedLessons[lesson.id]).toBe("2026-10-03T12:00:00Z");
  });
  it("counts repeated correct submissions once", () => {
    const state = answerQuestion(
      freshProgress(),
      lesson.quiz.id,
      lesson.quiz.correctIndex,
    );
    expect(
      totals(answerQuestion(state, lesson.quiz.id, lesson.quiz.correctIndex))
        .correct,
    ).toBe(1);
  });
  it("counts an incorrect then correct retry once and remembers ever-correct", () => {
    const wrong = (lesson.quiz.correctIndex + 1) % lesson.quiz.options.length;
    const state = answerQuestion(freshProgress(), lesson.quiz.id, wrong);
    expect(totals(state).correct).toBe(0);
    const corrected = answerQuestion(
      state,
      lesson.quiz.id,
      lesson.quiz.correctIndex,
    );
    expect(totals(corrected).correct).toBe(1);
    expect(
      totals(answerQuestion(corrected, lesson.quiz.id, wrong)).correct,
    ).toBe(1);
  });
  it("permits completion independently of quiz results", () =>
    expect(totals(completeLesson(freshProgress(), lesson.id))).toEqual({
      completed: 1,
      correct: 0,
    }));
  it("reset keeps the chosen level and assessment history", () => {
    const state = completeLesson(
      {
        ...freshProgress(),
        selectedLevel: "Advanced",
        assessment: {
          answers: {},
          score: 5,
          completedAt: "2026-10-03T12:00:00Z",
        },
      },
      lesson.id,
    );
    const reset = resetProgress(
      answerQuestion(state, lesson.quiz.id, lesson.quiz.correctIndex),
    );
    expect(reset.selectedLevel).toBe("Advanced");
    expect(reset.assessment?.score).toBe(5);
    expect(totals(reset)).toEqual({ completed: 0, correct: 0 });
  });
  it("ignores unknown lesson IDs and invalid answer indices", () => {
    expect(completeLesson(freshProgress(), "unknown")).toEqual(freshProgress());
    expect(answerQuestion(freshProgress(), lesson.quiz.id, 99)).toEqual(
      freshProgress(),
    );
  });
});
describe("storage validation", () => {
  afterEach(() => vi.unstubAllGlobals());
  it.each([
    null,
    "not json",
    "[]",
    "null",
    '{"version":99}',
    '{"version":1,"completedLessons":null,"quizResults":false}',
  ])("recovers from %s", (raw) =>
    expect(parseProgress(raw)).toEqual(freshProgress()),
  );
  it("distinguishes unchosen from explicitly chosen Beginner", () => {
    expect(parseProgress(null).selectedLevel).toBeNull();
    expect(
      parseProgress(
        JSON.stringify({ ...freshProgress(), selectedLevel: "Beginner" }),
      ).selectedLevel,
    ).toBe("Beginner");
  });
  it("preserves valid fields and ignores bad values", () => {
    const state = parseProgress(
      JSON.stringify({
        version: 1,
        selectedLevel: "Advanced",
        completedLessons: {
          [lessons[0].id]: "2026-10-03T12:00:00Z",
          unknown: "bad",
        },
        quizResults: { nope: {} },
      }),
    );
    expect(state.selectedLevel).toBe("Advanced");
    expect(totals(state).completed).toBe(1);
    expect(totals(state).correct).toBe(0);
  });
  it("round-trips completions and quiz results", () => {
    const state = answerQuestion(
      completeLesson(freshProgress(), lessons[0].id),
      lessons[0].quiz.id,
      lessons[0].quiz.correctIndex,
    );
    expect(parseProgress(JSON.stringify(state))).toEqual(state);
  });
  it("falls back to memory when storage throws", () => {
    vi.stubGlobal("localStorage", {
      getItem: () => {
        throw new Error("denied");
      },
      setItem: () => {
        throw new Error("full");
      },
    });
    expect(loadProgress()).toEqual({
      progress: freshProgress(),
      storageAvailable: false,
    });
    expect(persistProgress(freshProgress())).toBe(false);
  });
});
describe("content integrity", () => {
  it("contains 15 lessons with unique IDs, routes and questions", () => {
    expect(decoderLessons).toHaveLength(10);
    expect(fundamentalLessons).toHaveLength(5);
    expect(new Set(lessons.map((l) => l.id)).size).toBe(15);
    expect(new Set(lessons.map((l) => l.quiz.id)).size).toBe(15);
    expect(new Set(lessons.map((l) => `${l.kind}/${l.slug}`)).size).toBe(15);
  });
  it("has three terms, a valid answer and source links for each lesson", () => {
    lessons.forEach((l) => {
      expect(l.terms).toHaveLength(3);
      expect(l.quiz.options[l.quiz.correctIndex]).toBeTruthy();
      expect(l.sources.length).toBeGreaterThan(0);
      expect(l.contentReviewedAt).toMatch(/^\d{4}-\d{2}-\d{2}$/);
      l.sources.forEach((s) => expect(new URL(s.url).protocol).toBe("https:"));
    });
    decoderLessons.forEach((l) => {
      expect(l.headline).toBeTruthy();
      for (const level of ["Beginner", "Intermediate", "Advanced"] as const)
        expect(l.explanations?.[level].length).toBeGreaterThan(0);
    });
  });
});

describe("local data deletion", () => {
  it("removes only FinancePath profile and progress", async () => {
    const { deleteSavedLearningData, STORAGE_KEY } = await import("./progress");
    const removed: string[] = [];
    expect(
      deleteSavedLearningData({
        removeItem: (key: string) => removed.push(key),
      }),
    ).toBe(true);
    expect(removed).toEqual([STORAGE_KEY, "financepath.profile.v1"]);
  });
  it("reports denied storage instead of claiming successful deletion", async () => {
    const { deleteSavedLearningData } = await import("./progress");
    expect(
      deleteSavedLearningData({
        removeItem: () => {
          throw new Error("Denied");
        },
      }),
    ).toBe(false);
  });
});

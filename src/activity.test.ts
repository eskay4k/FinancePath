import { describe, expect, it } from "vitest";
import { dayKey, isDayKey, shiftDay, streakStats } from "./activity";
import {
  completeLesson,
  finishArticle,
  freshProgress,
  parseProgress,
  recordActivity,
  resetProgress,
} from "./progress";
import { lessons } from "./data/lessons";
describe("learning days and streaks", () => {
  it("validates real calendar dates including leap days", () => {
    expect(isDayKey("2024-02-29")).toBe(true);
    expect(isDayKey("2026-02-29")).toBe(false);
    expect(isDayKey("2026-10-32")).toBe(false);
    expect(isDayKey("2026-1-03")).toBe(false);
  });
  it("uses the local calendar day rather than slicing a UTC timestamp", () => {
    const date = new Date(2026, 9, 3, 23, 59);
    expect(dayKey(date)).toBe("2026-10-03");
  });
  it("crosses month and year boundaries without DST arithmetic", () => {
    expect(shiftDay("2026-01-01", -1)).toBe("2025-12-31");
    expect(shiftDay("2024-02-28", 1)).toBe("2024-02-29");
  });
  it("keeps yesterday’s streak alive until the current day ends", () => {
    expect(
      streakStats(["2026-10-01", "2026-10-02"], "2026-10-03").current,
    ).toBe(2);
  });
  it("breaks an old streak but preserves the best", () => {
    expect(
      streakStats(["2026-09-28", "2026-09-29", "2026-10-03"], "2026-10-03"),
    ).toEqual({ current: 1, best: 2, learnedToday: true, totalDays: 3 });
    expect(streakStats(["2026-09-28"], "2026-10-03").current).toBe(0);
  });
  it("deduplicates repeated activity and ignores future days", () => {
    expect(
      streakStats(
        ["2026-10-02", "2026-10-02", "2026-10-03", "2026-10-04"],
        "2026-10-03",
      ).current,
    ).toBe(2);
    expect(streakStats(["2026-10-04"], "2026-10-03").totalDays).toBe(0);
  });
  it("records re-reading on a new day without inflating lesson counts", () => {
    const first = completeLesson(
      freshProgress(),
      lessons[0].id,
      "2026-10-02T12:00:00Z",
    );
    const again = completeLesson(first, lessons[0].id, "2026-10-03T12:00:00Z");
    expect(Object.keys(again.completedLessons)).toHaveLength(1);
    expect(again.activityDays).toHaveLength(2);
  });
  it("article reads count once a day and can earn another learning day on a revisit", () => {
    const first = finishArticle(
      freshProgress(),
      "news-test",
      "2026-10-02T12:00:00Z",
    );
    const same = finishArticle(first, "news-test", "2026-10-02T15:00:00Z");
    const next = finishArticle(same, "news-test", "2026-10-03T12:00:00Z");
    expect(same.activityDays).toHaveLength(1);
    expect(next.activityDays).toHaveLength(2);
    expect(Object.keys(next.readArticles)).toHaveLength(1);
  });
  it("invalid activity cannot corrupt state", () => {
    const state = freshProgress();
    expect(recordActivity(state, "2026-02-30")).toBe(state);
    expect(finishArticle(state, "../bad")).toBe(state);
    expect(finishArticle(state, "news-test", "bad-date")).toBe(state);
  });
  it("loads previous progress records and migrates existing completion dates", () => {
    const legacy = {
      version: 1,
      selectedLevel: "Beginner",
      completedLessons: { [lessons[0].id]: "2026-10-02T12:00:00Z" },
      quizResults: {},
      assessment: null,
    };
    expect(parseProgress(JSON.stringify(legacy)).activityDays).toEqual([
      "2026-10-02",
    ]);
  });
  it("filters malformed activity and preserves valid article reads", () => {
    const state = parseProgress(
      JSON.stringify({
        ...freshProgress(),
        activityDays: ["2026-10-03", "bad", "2026-10-03", "2026-02-30"],
        readArticles: {
          "news-test": "2026-10-03T12:00:00Z",
          "../bad": "2026-10-03T12:00:00Z",
        },
      }),
    );
    expect(state.activityDays).toEqual(["2026-10-03"]);
    expect(Object.keys(state.readArticles)).toEqual(["news-test"]);
  });
  it("reset clears learning history while retaining level", () => {
    const state = finishArticle(
      { ...freshProgress(), selectedLevel: "Advanced" },
      "news-test",
    );
    const reset = resetProgress(state);
    expect(reset.activityDays).toEqual([]);
    expect(reset.readArticles).toEqual({});
    expect(reset.selectedLevel).toBe("Advanced");
  });
});

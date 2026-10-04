import { parseProgress, freshProgress, type Progress } from "./progress";
export interface LearningSnapshot {
  name: string;
  progress: Progress;
}
export function accountCacheKey(id: string) {
  return `financepath.account.${id}.v1`;
}
export function readAccountCache(
  storage: Pick<Storage, "getItem">,
  id: string,
): LearningSnapshot | null {
  try {
    const raw = JSON.parse(storage.getItem(accountCacheKey(id)) ?? "null");
    if (typeof raw?.name !== "string" || !raw.name.trim()) return null;
    return {
      name: raw.name.trim().slice(0, 40),
      progress: parseProgress(JSON.stringify(raw.progress)),
    };
  } catch {
    return null;
  }
}
export function remoteSnapshot(
  name: unknown,
  progress: unknown,
): LearningSnapshot {
  return {
    name:
      typeof name === "string" && name.trim()
        ? name.trim().slice(0, 40)
        : "Learner",
    progress: progress
      ? parseProgress(JSON.stringify(progress))
      : freshProgress(),
  };
}
export function mergeLearningProgress(
  current: Progress,
  incoming: Progress,
): Progress {
  const quizzes = { ...incoming.quizResults, ...current.quizResults };
  for (const [id, result] of Object.entries(quizzes)) {
    quizzes[id] = {
      ...result,
      everCorrect: Boolean(
        current.quizResults[id]?.everCorrect ||
        incoming.quizResults[id]?.everCorrect,
      ),
    };
  }
  const completed = { ...current.completedLessons };
  for (const [id, date] of Object.entries(incoming.completedLessons)) {
    if (!completed[id] || Date.parse(date) < Date.parse(completed[id]))
      completed[id] = date;
  }
  const reads = { ...current.readArticles };
  for (const [id, date] of Object.entries(incoming.readArticles)) {
    if (!reads[id] || Date.parse(date) > Date.parse(reads[id]))
      reads[id] = date;
  }
  const assessment = !current.assessment
    ? incoming.assessment
    : incoming.assessment &&
        Date.parse(incoming.assessment.completedAt) >
          Date.parse(current.assessment.completedAt)
      ? incoming.assessment
      : current.assessment;
  return parseProgress(
    JSON.stringify({
      ...current,
      selectedLevel: current.selectedLevel ?? incoming.selectedLevel,
      completedLessons: completed,
      quizResults: quizzes,
      activityDays: [
        ...new Set([...current.activityDays, ...incoming.activityDays]),
      ],
      readArticles: reads,
      assessment,
    }),
  );
}

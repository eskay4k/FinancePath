import { ArrowUpRight, Clock3, CircleCheck } from "lucide-react";
import { Link } from "react-router-dom";
import type { Lesson } from "../data/types";
import { useProgress } from "../useProgress";
export function LessonCard({
  lesson,
  returnTo,
}: {
  lesson: Lesson;
  returnTo?: string;
}) {
  const { progress } = useProgress();
  const completed = !!progress.completedLessons[lesson.id];
  return (
    <Link
      className="lesson-card"
      to={`/${lesson.kind}/${lesson.slug}`}
      state={{ returnTo }}
    >
      <div className="card-meta">
        <span className="topic-tag">{lesson.topic}</span>
        <span>
          {completed ? (
            <>
              <CircleCheck size={15} aria-hidden="true" /> Completed
            </>
          ) : (
            <>
              <Clock3 size={15} aria-hidden="true" /> {lesson.minutes} min
            </>
          )}
        </span>
      </div>
      <h3>{lesson.title}</h3>
      <p>{lesson.summary}</p>
      <div className="card-bottom">
        <span>
          {lesson.kind === "decoder"
            ? "Decode this headline"
            : "Explore the lesson"}
        </span>
        <ArrowUpRight size={20} aria-hidden="true" />
      </div>
    </Link>
  );
}

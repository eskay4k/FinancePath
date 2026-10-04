import { useState } from "react";
import { ChevronLeft, ChevronRight, Flame, Check } from "lucide-react";
import { dayKey, streakStats } from "../activity";
import { useProgress } from "../useProgress";
export function LearningCalendar() {
  const { progress } = useProgress();
  const today = dayKey();
  const stats = streakStats(progress.activityDays, today);
  const [month, setMonth] = useState(
    () => new Date(new Date().getFullYear(), new Date().getMonth(), 1),
  );
  const [selected, setSelected] = useState(today);
  const start = month.getDay();
  const number = new Date(
    month.getFullYear(),
    month.getMonth() + 1,
    0,
  ).getDate();
  const change = (amount: number) => {
    const next = new Date(month.getFullYear(), month.getMonth() + amount, 1);
    setMonth(next);
    setSelected(dayKey(next));
  };
  const monthName = month.toLocaleDateString("en-US", {
    month: "long",
    year: "numeric",
  });
  return (
    <section className="learning-calendar">
      <div className="streak-heading">
        <Flame size={25} aria-hidden="true" />
        <div>
          <h2>{stats.current} day streak</h2>
          <p>
            {stats.learnedToday
              ? "You’ve learned today. Nice work."
              : "Read an article or complete a quiz to keep it going."}
          </p>
        </div>
      </div>
      <div className="calendar-toolbar">
        <button aria-label="Previous month" onClick={() => change(-1)}>
          <ChevronLeft size={19} />
        </button>
        <strong>{monthName}</strong>
        <button
          aria-label="Next month"
          onClick={() => change(1)}
          disabled={dayKey(month).slice(0, 7) >= today.slice(0, 7)}
        >
          <ChevronRight size={19} />
        </button>
      </div>
      <div className="calendar-grid">
        <div className="calendar-weekdays">
          {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((d) => (
            <span key={d}>{d}</span>
          ))}
        </div>
        <div className="calendar-days">
          {Array.from({ length: start }, (_, i) => (
            <span key={`blank-${i}`} />
          ))}
          {Array.from({ length: number }, (_, i) => {
            const day = dayKey(
              new Date(month.getFullYear(), month.getMonth(), i + 1),
            );
            const learned = progress.activityDays.includes(day);
            return (
              <button
                key={day}
                aria-label={`${day}${learned ? ", learning completed" : ", no learning recorded"}`}
                aria-pressed={selected === day}
                className={`${learned ? "learned" : ""} ${day === today ? "today" : ""}`}
                disabled={day > today}
                onClick={() => setSelected(day)}
              >
                {i + 1}
                {learned && <Check size={11} aria-hidden="true" />}
              </button>
            );
          })}
        </div>
      </div>
      <p className="calendar-selection" role="status">
        {new Date(`${selected}T12:00:00`).toLocaleDateString("en-US", {
          month: "short",
          day: "numeric",
        })}
        :{" "}
        {progress.activityDays.includes(selected)
          ? "Learning completed."
          : "No learning recorded."}
      </p>
      <div className="calendar-footer">
        <span>
          Best: {stats.best} {stats.best === 1 ? "day" : "days"}
        </span>
        <span>{stats.totalDays} learning days</span>
      </div>
      <p className="calendar-note">
        One learning day counts once. Your local time sets the day.
      </p>
    </section>
  );
}

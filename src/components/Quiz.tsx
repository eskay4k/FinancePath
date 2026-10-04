import { useState, useRef } from "react";
import { CircleCheck, RotateCcw, Lightbulb } from "lucide-react";
import type { Question } from "../data/types";
import { useProgress } from "../useProgress";
import { answerQuestion } from "../progress";
export function Quiz({ question }: { question: Question }) {
  const { progress, setProgress } = useProgress();
  const result = progress.quizResults[question.id];
  const [selected, setSelected] = useState<number | null>(
    result?.selectedIndex ?? null,
  );
  const [retrying, setRetrying] = useState(false);
  const submitted = !!result && !retrying;
  const feedbackRef = useRef<HTMLDivElement>(null);
  const firstOptionRef = useRef<HTMLInputElement>(null);
  return (
    <section className="quiz-section" aria-labelledby="quiz-heading">
      <div className="section-label">
        <Lightbulb size={19} aria-hidden="true" /> Put it into practice
      </div>
      <h2 id="quiz-heading">Check your understanding</h2>
      <form
        onSubmit={(event) => {
          event.preventDefault();
          if (selected !== null) {
            setProgress((p) => answerQuestion(p, question.id, selected));
            setRetrying(false);
            requestAnimationFrame(() => feedbackRef.current?.focus());
          }
        }}
      >
        <fieldset>
          <legend>{question.prompt}</legend>
          <div className="quiz-options">
            {question.options.map((option, index) => (
              <label
                className={`quiz-option ${selected === index ? "chosen" : ""}`}
                key={option}
              >
                <input
                  ref={index === 0 ? firstOptionRef : undefined}
                  type="radio"
                  name={question.id}
                  checked={selected === index}
                  onChange={() => setSelected(index)}
                  disabled={submitted}
                />
                <span>{option}</span>
                {submitted && index === question.correctIndex && (
                  <CircleCheck size={20} aria-label="Correct answer" />
                )}
              </label>
            ))}
          </div>
        </fieldset>
        {!submitted && (
          <button
            className="button primary"
            type="submit"
            disabled={selected === null}
          >
            Check answer
          </button>
        )}
      </form>
      <div aria-live="polite" aria-atomic="true">
        {submitted && (
          <div
            ref={feedbackRef}
            tabIndex={-1}
            className={`quiz-feedback ${result.lastCorrect ? "correct" : ""}`}
          >
            <strong>
              {result.lastCorrect
                ? "That’s right."
                : "Keep learning. Here’s the reasoning."}
            </strong>
            <p>{question.explanation}</p>
            {!result.lastCorrect && (
              <button
                className="text-button"
                onClick={() => {
                  setRetrying(true);
                  setSelected(null);
                  requestAnimationFrame(() => firstOptionRef.current?.focus());
                }}
              >
                <RotateCcw size={16} aria-hidden="true" /> Try again
              </button>
            )}
          </div>
        )}
      </div>
    </section>
  );
}

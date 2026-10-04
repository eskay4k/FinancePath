import { useState, useRef } from "react";
import { CompanionArt } from "../components/Companion";
import { useNavigate, useSearchParams } from "react-router-dom";
import { ArrowLeft, ArrowRight, GraduationCap } from "lucide-react";
import { assessmentQuestions, recommendLevel } from "../data/assessment";
import { levelDescriptions } from "../data/levels";
import type { Level } from "../data/types";
import { recordActivity } from "../progress";
import { useProgress } from "../useProgress";
import { levels } from "../data/types";
import { useMetadata } from "../useMetadata";

export function Assessment() {
  useMetadata(
    "Find your learning level",
    "An optional six-question assessment to find a comfortable starting point for financial learning.",
  );
  const { profile, setProgress } = useProgress();
  const [params] = useSearchParams();
  const onboarding = params.get("onboarding") === "1";
  const destination = profile ? "/dashboard" : "/decoder";
  const [answers, setAnswers] = useState<Record<string, number>>({});
  const [step, setStep] = useState(0);
  const [finished, setFinished] = useState(false);
  const [chosen, setChosen] = useState<Level | null>(null);
  const question = assessmentQuestions[step];
  const score = assessmentQuestions.filter(
    (q) => answers[q.id] === q.correctIndex,
  ).length;
  const recommended = recommendLevel(score);
  const navigate = useNavigate();
  const headingRef = useRef<HTMLHeadingElement>(null);
  function changeStep(next: number) {
    setStep(next);
    requestAnimationFrame(() => headingRef.current?.focus());
  }
  function finish() {
    setFinished(true);
    setChosen(recommended);
    setProgress((p) =>
      recordActivity({
        ...p,
        assessment: { answers, score, completedAt: new Date().toISOString() },
      }),
    );
    requestAnimationFrame(() => headingRef.current?.focus());
  }
  return (
    <div className="container page assessment-page">
      {onboarding && !finished && (
        <div className="setup-step">Step 2 of 2 · Your starting level</div>
      )}
      {!finished && (
        <button
          className="text-button assessment-skip"
          onClick={() => {
            setProgress((p) => ({
              ...p,
              selectedLevel: "Beginner",
            }));
            navigate(destination);
          }}
        >
          Skip for now · Start with Beginner
        </button>
      )}
      <div className="assessment-shell">
        <div className="assessment-intro">
          <GraduationCap size={29} aria-hidden="true" />
          <span className="section-label">Find your starting point</span>
          <h1 tabIndex={-1}>
            {finished
              ? "Your path starts here."
              : "A few questions. A little direction."}
          </h1>
          <p>
            This optional check helps you choose an explanation level. It’s a
            starting point, not a measure of your financial ability.
          </p>
        </div>
        {finished ? (
          <section className="assessment-result">
            <div className="recommendation-hero">
              <CompanionArt level={recommended} />
              <div>
                <span className="recommendation-tag">Recommended for you</span>
                <h2 tabIndex={-1} ref={headingRef}>
                  {recommended}
                </h2>
                <p>Based on your score: {score} out of 6.</p>
              </div>
            </div>
            <p>
              {levelDescriptions[recommended]} We recommend starting here. Your
              dashboard will show you what to learn next.
            </p>
            <fieldset className="recommended-levels">
              <legend>Choose your starting level</legend>
              {levels.map((l) => (
                <label
                  key={l}
                  className={(chosen ?? recommended) === l ? "chosen" : ""}
                >
                  <input
                    type="radio"
                    name="recommended-level"
                    checked={(chosen ?? recommended) === l}
                    onChange={() => setChosen(l)}
                  />
                  <span>
                    <strong>{l}</strong>
                    {l === recommended && <b>Recommended · {score}/6</b>}
                    <span>{levelDescriptions[l]}</span>
                  </span>
                </label>
              ))}
            </fieldset>
            <button
              className="button primary"
              onClick={() => {
                setProgress((p) => ({
                  ...p,
                  selectedLevel: chosen ?? recommended,
                }));
                navigate(destination);
              }}
            >
              Start my {chosen ?? recommended} path
              <ArrowRight size={18} aria-hidden="true" />
            </button>
            <button
              className="text-button"
              onClick={() => {
                setFinished(false);
                changeStep(0);
              }}
            >
              Review my answers
            </button>
          </section>
        ) : (
          <section className="assessment-question">
            <div className="assessment-progress">
              <span>Question {step + 1} of 6</span>
              <span>About 2 minutes</span>
            </div>
            <progress
              value={step + 1}
              max={6}
              aria-label="Assessment question progress"
            />
            <h2 ref={headingRef} tabIndex={-1}>
              {question.prompt}
            </h2>
            <fieldset>
              <legend className="sr-only">Choose one answer</legend>
              <div className="quiz-options">
                {question.options.map((option, i) => (
                  <label
                    className={`quiz-option ${answers[question.id] === i ? "chosen" : ""}`}
                    key={option}
                  >
                    <input
                      type="radio"
                      name={question.id}
                      checked={answers[question.id] === i}
                      onChange={() =>
                        setAnswers((p) => ({ ...p, [question.id]: i }))
                      }
                    />
                    <span>{option}</span>
                  </label>
                ))}
              </div>
            </fieldset>
            <div className="assessment-actions">
              <button
                className="button secondary"
                disabled={step === 0}
                onClick={() => changeStep(step - 1)}
              >
                <ArrowLeft size={16} aria-hidden="true" /> Back
              </button>
              <button
                className="button primary"
                disabled={answers[question.id] === undefined}
                onClick={() => (step === 5 ? finish() : changeStep(step + 1))}
              >
                {step === 5 ? "See my recommendation" : "Next"}
                <ArrowRight size={17} aria-hidden="true" />
              </button>
            </div>
            <p className="assessment-note">
              Choose the best answer. No pressure, and no trick questions.
            </p>
          </section>
        )}
      </div>
    </div>
  );
}

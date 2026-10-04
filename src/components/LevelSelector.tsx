import { levels, type Level } from "../data/types";
export function LevelSelector({
  value,
  onChange,
  label = "Explanation level",
}: {
  value: Level;
  onChange: (level: Level) => void;
  label?: string;
}) {
  return (
    <fieldset className="level-field">
      <legend className="sr-only">{label}</legend>
      <div className="level-control">
        {levels.map((level) => (
          <label key={level} className={value === level ? "selected" : ""}>
            <input
              type="radio"
              name={label}
              value={level}
              checked={value === level}
              onChange={() => onChange(level)}
            />
            <span>{level}</span>
          </label>
        ))}
      </div>
    </fieldset>
  );
}

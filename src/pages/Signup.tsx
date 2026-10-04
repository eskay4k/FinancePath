import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ArrowRight, Sprout } from "lucide-react";
import { useProgress } from "../useProgress";
import { useMetadata } from "../useMetadata";
export function Signup() {
  useMetadata(
    "Make FinancePath yours",
    "Set up your learning profile, find your level, and start learning.",
  );
  const { profile, saveProfile } = useProgress();
  const [name, setName] = useState(profile?.name ?? "");
  const [ageConfirmed, setAgeConfirmed] = useState(false);
  const navigate = useNavigate();
  return (
    <div className="setup-page container">
      <div className="setup-step">Step 1 of 2 · Your profile</div>
      <section className="setup-card">
        <span className="setup-icon">
          <Sprout size={30} aria-hidden="true" />
        </span>
        <h1 tabIndex={-1}>Let’s make this your path.</h1>
        <p>First, what should we call you?</p>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            if (name.trim() && ageConfirmed) {
              saveProfile(name);
              navigate("/assessment?onboarding=1");
            }
          }}
        >
          <label htmlFor="profile-name">Your first name or nickname</label>
          <input
            id="profile-name"
            name="nickname"
            autoComplete="nickname"
            value={name}
            maxLength={40}
            required
            onChange={(e) => setName(e.target.value)}
            placeholder="e.g. Alex"
          />
          <label className="profile-consent">
            <input
              type="checkbox"
              checked={ageConfirmed}
              onChange={(e) => setAgeConfirmed(e.target.checked)}
              required
            />{" "}
            I am 13 or older and want to save my nickname and learning progress
            in this browser.
          </label>
          <p className="profile-policy-links">
            Read our <Link to="/legal/privacy">privacy policy</Link> and{" "}
            <Link to="/legal/terms">terms of use</Link>.
          </p>
          <button
            className="button primary"
            type="submit"
            disabled={!name.trim() || !ageConfirmed}
          >
            Find my level <ArrowRight size={18} aria-hidden="true" />
          </button>
        </form>
        <p className="profile-note">
          This MVP creates a learning profile saved in this browser. It isn’t an
          online account, and it won’t sync across devices.
        </p>
      </section>
      <Link className="back-link" to="/">
        Back to home
      </Link>
    </div>
  );
}

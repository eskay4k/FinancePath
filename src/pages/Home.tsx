import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import { MoneyGarden } from "../components/MoneyGarden";
import { useProgress } from "../useProgress";
import { useMetadata } from "../useMetadata";
export function Home() {
  useMetadata(
    "Get a little better with money",
    "Short finance lessons at your level. Find your starting point and build your knowledge with FinancePath.",
  );
  const { profile } = useProgress();
  return (
    <div className="landing-page">
      <section className="welcome-section container">
        <div className="welcome-art">
          <MoneyGarden />
        </div>
        <div className="welcome-copy">
          <h1 tabIndex={-1}>
            Get a little better
            <br />
            with money.
          </h1>
          <p>
            Finance can feel complicated. Learning it doesn’t have to. Build
            your confidence with short lessons that meet you where you are.
          </p>
          <div className="welcome-actions">
            <Link
              className="button primary"
              to={profile ? "/dashboard" : "/signup"}
            >
              {profile ? "Go to my dashboard" : "Get started"}
              <ArrowRight size={19} aria-hidden="true" />
            </Link>
          </div>
          <span className="welcome-note">
            Free to learn. For every starting point.
          </span>
        </div>
      </section>
      <div
        className="landing-steps container"
        aria-label="How FinancePath works"
      >
        <span>
          <b>1</b> Make it yours
        </span>
        <span>
          <b>2</b> Find your level
        </span>
        <span>
          <b>3</b> Learn a little, grow a little
        </span>
      </div>
    </div>
  );
}

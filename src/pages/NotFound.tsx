import { Link } from "react-router-dom";
import { ArrowRight, Compass } from "lucide-react";
import { useMetadata } from "../useMetadata";

export function NotFound() {
  useMetadata("Page not found", "Find your way back to FinancePath lessons.");
  return (
    <div className="container page empty-state not-found">
      <Compass size={42} aria-hidden="true" />
      <span className="section-label">A small detour</span>
      <h1 tabIndex={-1}>Let’s find your path again.</h1>
      <p>This page doesn’t exist. There’s still plenty to explore.</p>
      <Link className="button primary" to="/decoder">
        Explore lessons <ArrowRight size={17} aria-hidden="true" />
      </Link>
    </div>
  );
}

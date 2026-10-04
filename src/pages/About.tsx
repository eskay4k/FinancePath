import { Compass } from "lucide-react";
import { levels } from "../data/types";
import { levelDescriptions } from "../data/levels";
import { FOUNDER_NAME, FOUNDER_BIO, LEGAL_CONTACT } from "../config";
import { useMetadata } from "../useMetadata";

export function About() {
  useMetadata(
    "About and methodology",
    "Learn about FinancePath’s student-led mission, explanation levels, and educational sources.",
  );
  return (
    <div className="container page about-page">
      <div className="page-intro">
        <span className="section-label">
          <Compass size={18} aria-hidden="true" /> Our purpose
        </span>
        <h1 tabIndex={-1}>
          Finance is part of life.
          <br />
          Understanding it should be, too.
        </h1>
        <p>
          FinancePath is a student-led financial-literacy project built to make
          complicated information easier to understand.
        </p>
      </div>
      <div className="about-layout">
        <aside className="about-nav">
          <a href="#mission">The mission</a>
          <a href="#levels">Three learning levels</a>
          <a href="#methodology">Our methodology</a>
          <a href="#education">Education, not advice</a>
          <a href="#founder">The founder</a>
        </aside>
        <article>
          <section id="mission">
            <h2>A clearer starting point</h2>
            <p>
              Financial headlines assume you already know the language. For
              students and beginners, terms like inflation, policy rates, and
              diversification can turn useful information into a wall of
              unfamiliar words.
            </p>
            <p>
              Our mission is to make that first step easier. FinancePath
              connects financial concepts to everyday examples and gives you
              room to ask questions, change levels, and learn at your own pace.
            </p>
          </section>
          <section id="levels">
            <h2>One concept. Three ways in.</h2>
            <p>
              Every Decoder lesson explains the same underlying concept at three
              levels. The depth changes; the facts stay consistent.
            </p>
            <dl className="about-levels">
              {levels.map((l) => (
                <div key={l}>
                  <dt>{l}</dt>
                  <dd>{levelDescriptions[l]}</dd>
                </div>
              ))}
            </dl>
            <p>
              The optional assessment recommends a starting point. It is an
              informal check, not a credential or a judgment of financial
              ability.
            </p>
          </section>
          <section id="methodology">
            <h2>Sources before shortcuts</h2>
            <p>
              Lessons draw on educational and primary sources matched to their
              topic: the Federal Reserve for monetary policy, the Bureau of
              Labor Statistics for economic measures, the SEC’s Investor.gov for
              investing concepts, and the CFPB for credit information.
            </p>
            <p>
              We also use topic-specific sources such as the U.S. Treasury,
              FINRA, and Freddie Mac. Each lesson links to its references and
              shows when its content was reviewed. Sources support the
              explanations; they are not endorsements of FinancePath.
            </p>
            <p>
              The Headlines page automatically checks BBC Business, CNBC, NPR,
              The New York Times, and Federal Reserve publisher feeds. Stories
              show their source and publication date, with original articles
              linked. Reading guidance changes by level; the publisher’s
              reporting stays at its source. If the feed cannot refresh, a dated
              backup collection is clearly marked.
            </p>
            <p>
              Headline practice lessons use illustrative examples. Numerical
              examples are hypothetical unless linked to a source. Review dates
              describe lesson content, not the date of a news event.
            </p>
          </section>
          <section id="education">
            <h2>Understanding, not instructions</h2>
            <p>
              FinancePath provides general financial education. It does not
              offer personalized financial, investment, tax, or legal advice.
              Lessons do not recommend buying or selling investments, predict
              returns, or promise outcomes.
            </p>
            <p>
              Financial circumstances differ. Learning a concept is a useful
              starting point, but it is not a substitute for considering your
              situation or seeking qualified professional guidance when needed.
            </p>
          </section>
          <section id="founder" className="founder-section">
            <span className="section-label">Meet the founder</span>
            <h2>{FOUNDER_NAME}</h2>
            <p>{FOUNDER_BIO}</p>
            <p>
              <a href={`mailto:${LEGAL_CONTACT}`}>Contact Saad</a> for feedback,
              questions, or accessibility support.
            </p>
          </section>
          <section>
            <h2>Your account, your progress</h2>
            <p>
              An account saves your nickname and learning progress with Supabase, so you can continue on another device. Earlier browser-only progress can be imported from Account settings. The app keeps a local cache for connection failures. FinancePath itself has no analytics or advertising tracking; the optional TradingView chart uses its own privacy practices.
            </p>
          </section>
        </article>
      </div>
    </div>
  );
}

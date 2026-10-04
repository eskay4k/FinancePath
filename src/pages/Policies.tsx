import { useState } from "react";
import { Link, useParams } from "react-router-dom";
import { useAuth } from "../auth-context";
import { useProgress } from "../useProgress";
import { useMetadata } from "../useMetadata";
import { LEGAL_OPERATOR, LEGAL_CONTACT, LEGAL_STATE } from "../config";
const content: Record<string, { title: string; sections: [string, string][] }> =
  {
    privacy: {
      title: "Privacy policy",
      sections: [
        [
          "Your learning data",
          "When you create an account, Supabase handles your email and password authentication. FinancePath stores your nickname, selected level, assessment answers, lesson and quiz progress, article reads, and learning dates in your private account database so they can sync across devices. Account data is also cached in this browser. Earlier guest progress is stored locally and is imported only when you choose to import it. Your profile and email are not sent to news, dictionary, or market-data providers. Use a nickname rather than your full legal name. Do not enter financial account numbers, payment details, or other sensitive information.",
        ],
        [
          "Requests and service providers",
          "Your browser contacts our host to load the site and its APIs. The host may process IP addresses, request times, URLs, and browser information for delivery, security, and operational logs. Vercel hosts the application and its news/dictionary APIs; Supabase provides account authentication and the progress database. These providers may process operational logs under their policies. Operational retention and backup schedules still require review. News requests are made by our server. The optional TradingView chart loads only after you choose Show market chart. Loading it sends your IP address and browser/device information directly to TradingView and its service providers; they may use cookies or similar storage under their own privacy policy. It is isolated from FinancePath’s profile storage. When you request a general word definition, the selected word is sent through our server to Wikimedia/Wiktionary. Publisher links open external sites with their own privacy policies. Optional read-aloud uses your browser or operating system voice service, which may process text remotely depending on your device.",
        ],
        [
          "Tracking and choices",
          "FinancePath itself includes no advertising pixels, analytics SDKs, marketing emails, or payments. The optional external chart has its own privacy practices. It does not sell learning-profile data. Fonts are served from this site. Local browser storage is used for the learning features you choose; see Storage & cookies for details. These statements describe this build and must be updated if integrations change.",
        ],
        [
          "Retention and deletion",
          "Account learning data remains until you clear learning progress or delete your account. Account settings includes permanent account deletion; the learning-data control below clears account progress while retaining your login and nickname. Guest progress remains locally until deleted. Local caches on other devices and provider logs/backups may remain subject to their retention policies. If you contact the operator, the operator must respond to applicable privacy requests and establish retention for those communications.",
        ],
        [
          "Children and regional rights",
          "The current learning profile is intended for people age 13 and older; we do not offer a parental-consent system. Do not submit children’s personal information. A simple age statement does not resolve every children’s privacy obligation, and the audience and integrations require review before launch. Privacy rights can vary by state and circumstances. Contact saadkxns@gmail.com for access, correction, deletion, or other applicable requests.",
        ],
      ],
    },
    terms: {
      title: "Terms of use",
      sections: [
        [
          "Learning purpose",
          "FinancePath is a free educational MVP for understanding financial concepts and published news. Its content is general information, not personalized investment, tax, accounting, or legal advice. It does not provide brokerage services, execute trades, manage money, or recommend buying or selling a security.",
        ],
        [
          "Accuracy and risk",
          "News, definitions, data, and explanations may be delayed, incomplete, incorrect, or unavailable. Dates and source links are provided so you can check original materials. Historical performance does not predict future results. Markets can lose value; you are responsible for decisions you make and should seek appropriately qualified advice when needed.",
        ],
        [
          "Your use",
          "Use a nickname and provide only information needed for learning. Do not misuse the service, bypass access controls, submit unlawful content, or infringe others’ rights. The current profile is for people 13 and older. No payment or subscription is required in this build.",
        ],
        [
          "Ownership and external material",
          "FinancePath’s original illustrations and educational explanations are separate from publisher journalism. Publisher titles and short excerpts remain the property of their respective owners. Attribution and links do not imply endorsement or partnership. Full articles stay on publisher sites and may require a subscription. Wiktionary definitions include source and license links. See Sources & licenses.",
        ],
        [
          "Service changes and your rights",
          "This MVP may change or be interrupted. Policies will be updated when functionality changes. Nothing here excludes rights or liabilities that applicable law does not allow to be excluded. These terms are a working draft pending operator details and jurisdiction-specific legal review; they do not establish an arbitration clause or choose a state’s governing law.",
        ],
      ],
    },
    cookies: {
      title: "Storage & cookies",
      sections: [
        [
          "What this build uses",
          "FinancePath’s application does not set tracking or advertising cookies. It uses two localStorage entries: financepath.profile.v1 for your nickname, and financepath.progress.v1 for your level and learning history. This data stays in this browser until you delete it. The site can run without storage, but progress will not persist.",
        ],
        [
          "Your choice",
          "Creating an account saves your email authentication record and learning information with Supabase; guest records stay in this browser until deliberately imported. Account sessions and cached learning records use browser storage for the requested login and learning features. This build has no optional analytics or advertising tracking. The optional TradingView chart is held behind a Show market chart button and is not loaded before you choose it; it may use cookies and process device data. Hide chart stops the embed but does not delete third-party cookies. This is not a determination for every jurisdiction: before launch, audit the actual host and any added services, and introduce consent controls before loading tracking that requires consent.",
        ],
        [
          "External sites",
          "Publisher links open other websites. Those sites control their own cookies and consent interfaces. Our server requests feeds and definitions; it does not embed publisher tracking scripts in your reading page.",
        ],
      ],
    },
    refunds: {
      title: "Pricing & refunds",
      sections: [
        [
          "Free MVP",
          "FinancePath currently charges no fees and collects no payment information. There are no paid subscriptions, automatic renewals, or hidden in-app charges, so there are no FinancePath purchases to refund.",
        ],
        [
          "Publisher subscriptions",
          "An external publisher may charge for its articles. Any purchase made there is governed by that publisher’s terms and refund policy.",
        ],
        [
          "Future paid features",
          "If paid features are introduced, prices, renewal conditions, cancellation steps, and an applicable refund policy must be published before checkout. This page must be updated before payments are enabled.",
        ],
      ],
    },
    sources: {
      title: "Sources & licenses",
      sections: [
        [
          "News",
          "This collection uses business feeds from BBC News, CNBC, NPR, and The New York Times, alongside Federal Reserve releases. Feed availability varies. Titles and brief excerpts link back to original reporting; full article text and publisher images are not republished. Educational guides are FinancePath’s original commentary, not publisher-approved summaries. No affiliation or endorsement is implied. RSS availability and a short excerpt are not a blanket license: publisher terms and intended public/commercial use require clearance before launch.",
        ],
        [
          "Market data",
          "Market charts use TradingView’s official embeddable Symbol Overview widget, including its branding and attribution. No API key is required for this embed. The displayed FOREX.com US 500, US 30, and US Tech 100 CFD series are index-linked proxies, not official cash index values; US Tech 100 is not the Nasdaq Composite. Provider pricing and trading hours may differ. Quotes, delays, market status, and chart intervals are provided by TradingView, with availability varying by symbol and exchange. FinancePath does not extract or republish the widget’s data. Educational explanations are separate from the chart; linked reporting does not prove why prices moved. Loading the optional chart is subject to TradingView’s terms and privacy practices.",
        ],
        [
          "Definitions, fonts, and graphics",
          "General word definitions come from Wiktionary, with a link to the entry and Creative Commons Attribution-ShareAlike 4.0 license beside each definition. Finance definitions and companion artwork are original to this app. Nunito is self-hosted under the SIL Open Font License, available below. Lucide icons use the ISC license. Dependency licenses and notices should be retained when redistributing the app.",
        ],
        [
          "Corrections and concerns",
          "Check the original source for current reporting and definitions. Once the operator’s contact is configured, use it to report an error, accessibility issue, or rights concern. The operator must assess concerns and correct or remove material as appropriate.",
        ],
      ],
    },
    accessibility: {
      title: "Accessibility",
      sections: [
        [
          "Using FinancePath",
          "The app includes a skip link, keyboard-operable controls, visible focus states, semantic headings, character descriptions, reduced-motion support. Word help is optional; its definition panel can be closed with Escape. Third-party chart accessibility is controlled by TradingView; an external markets link is available if the embed is inaccessible.",
        ],
        [
          "Feedback",
          "Accessibility is ongoing; this page does not claim certification or full WCAG conformance. If you encounter a barrier, contact the operator once the contact below is configured. Include the page, device/browser, and the action that failed, without sharing sensitive information.",
        ],
      ],
    },
  };
export function Policies() {
  const { kind = "privacy" } = useParams();
  const page = content[kind];
  const { user } = useAuth();
  const { deleteLearningData } = useProgress();
  const [confirm, setConfirm] = useState(false),
    [deleted, setDeleted] = useState(false),
    [deletionFailed, setDeletionFailed] = useState(false);
  useMetadata(
    page?.title ?? "Policy not found",
    "FinancePath policies, sources, and data choices.",
  );
  if (!page)
    return (
      <div className="container page">
        <h1 tabIndex={-1}>Policy not found</h1>
        <Link to="/legal/privacy">Privacy policy</Link>
      </div>
    );
  return (
    <div className="container page policy-page">
      <h1 tabIndex={-1}>{page.title}</h1>
      <p>Last updated October 4, 2026 · United States</p>
      <nav className="policy-nav" aria-label="Policies">
        {Object.entries(content).map(([k, v]) => (
          <Link
            key={k}
            to={`/legal/${k}`}
            aria-current={kind === k ? "page" : undefined}
          >
            {v.title}
          </Link>
        ))}
      </nav>
      <aside className="policy-draft">
        <strong>Pre-launch policy draft</strong>
        <p>
          Operator: {LEGAL_OPERATOR || "Not provided yet"} · State:{" "}
          {LEGAL_STATE || "Not provided yet"}
        </p>
        <p>
          Contact:{" "}
          {LEGAL_CONTACT ? (
            <a href={`mailto:${LEGAL_CONTACT}`}>{LEGAL_CONTACT}</a>
          ) : (
            "Not provided yet. A working privacy and support contact is required before public launch."
          )}
        </p>
      </aside>
      {page.sections.map(([title, text]) => (
        <section key={title}>
          <h2>{title}</h2>
          <p>{text}</p>
        </section>
      ))}
      {(kind === "sources" || kind === "privacy" || kind === "cookies") && (
        <p>
          <a
            href="https://www.tradingview.com/privacy-policy/"
            target="_blank"
            rel="noopener noreferrer"
          >
            TradingView privacy policy
          </a>
          {" · "}
          <a
            href="https://www.tradingview.com/policies/"
            target="_blank"
            rel="noopener noreferrer"
          >
            TradingView terms
          </a>
        </p>
      )}
      {kind === "sources" && (
        <p>
          <a href="/fonts/Nunito-OFL.txt">Nunito font license</a>
          {" · "}
          <a href="/THIRD-PARTY-NOTICES.txt">
            Third-party license notices
          </a> ·{" "}
          <a href="https://creativecommons.org/licenses/by-sa/4.0/">
            Wiktionary content license
          </a>
        </p>
      )}
      {(kind === "privacy" || kind === "cookies") && (
        <section className="policy-delete">
          <h2>Your saved learning data</h2>
          {deletionFailed && (
            <p role="alert">
              Learning progress could not be cleared. Wait for syncing to finish and retry; contact support if the problem continues. Clearing browser storage alone does not delete cloud data.
            </p>
          )}
          <p>
            {user ? "Clear your level, assessment, lessons, quiz results, article reads, and streak from your account and this browser. Your login and nickname stay available. Use Account settings to delete the entire account." : "Delete your nickname, level, assessment, lessons, quiz results, article reads, and streak from this browser."}
          </p>
          {deleted ? (
            <p role="status">
              Your learning progress has been cleared.
            </p>
          ) : confirm ? (
            <>
              <p>
                This cannot be undone. Delete all saved FinancePath learning
                data?
              </p>
              <button
                className="button secondary"
                onClick={async () => {
                  const success = await deleteLearningData();
                  setDeleted(success);
                  setDeletionFailed(!success);
                  setConfirm(false);
                }}
              >
                Delete my learning data
              </button>{" "}
              <button
                className="button secondary"
                onClick={() => setConfirm(false)}
              >
                Keep my data
              </button>
            </>
          ) : (
            <button
              className="button secondary"
              onClick={() => setConfirm(true)}
            >
              Manage data deletion
            </button>
          )}
        </section>
      )}
    </div>
  );
}

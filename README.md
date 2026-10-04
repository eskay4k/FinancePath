# FinancePath

A student-led financial-literacy frontend for high-school and college-age learners. Decode financial headlines at Beginner, Intermediate, or Advanced level, build foundational knowledge, and track your progress with a local learning profile.

## Run locally

Install Node.js 22.12+ (or a supported newer LTS release) and pnpm. Then run:

```sh
pnpm install
pnpm dev
```

Open the localhost URL shown in the terminal, normally `http://127.0.0.1:5173`.

```sh
pnpm typecheck  # TypeScript
pnpm lint       # ESLint
pnpm test       # Targeted state, scoring, storage, and content tests
pnpm build      # TypeScript plus production build in dist/
pnpm preview    # Serve the production build locally
```

No API keys or paid news subscription are needed. The app now includes a small read-only server endpoint for publisher RSS feeds; local profiles still do not use authentication. Vite serves the endpoint in development and preview, and Vercel runs it as a function. Dependencies are pinned by `pnpm-lock.yaml`. `pnpm-workspace.yaml` permits esbuild's required build script.

## What is included

- Simple landing page with a single entry action.
- Browser-only profile setup at `/signup`, then a guided level assessment.
- Learning dashboard at `/dashboard` with a recommended next lesson, basics path, and progress.
- Six-question assessment with a clearly marked, score-based recommendation and an explicit starting-path action.
- Pip, Finn, and Sage companions, interactive reading tips, optional browser speech, and level-adaptive presentation within one green identity.
- Automatic BBC, CNBC, NPR, New York Times, and Federal Reserve news feeds at `/headlines`, with publisher dates, day browsing, and level-specific reading guidance.
- Optional Word help in news and lessons, with a local finance glossary and general dictionary lookup.
- Learning calendar and current/best streaks based on actual learning activity.
- Ten Decoder lessons covering inflation, Fed rates, stock declines, recessions, jobs, tariffs, government debt, earnings, crypto volatility, and mortgage rates.
- Five Fundamentals lessons: stocks, bonds and rates, purchasing power, credit, and risk/diversification (including a compounding example).
- Per-lesson quizzes, retry feedback, independent completion, and a progress dashboard.
- About/methodology, configurable feedback, responsive navigation, and a not-found page.

The news feed contains real publisher stories. Headline practice lessons are illustrative, not live news. Numerical teaching examples are hypothetical. Content uses a U.S. context and is educational, not personalized financial advice.

## Edit the content

`src/data/lessons.ts` holds all lesson content as typed records. `src/data/types.ts` defines the structure. `src/data/assessment.ts` contains assessment questions and scoring boundaries.

To edit a lesson, update its text, answer explanation, and relevant source links together. After reviewing changes for accuracy, update `contentReviewedAt` using `YYYY-MM-DD`. This is a content review date, not a news publication date.

To add a lesson, copy the appropriate record shape and choose a unique, permanent lesson ID, question ID, and readable URL slug. Do not reuse an ID for a different concept. Libraries and detail pages derive their contents from these records. This MVP intentionally has 15 lessons; if you expand it, update the dashboard's total, homepage copy, and content integrity test together.

`src/pages/` contains page components, `src/components/` contains reusable UI, and `src/styles.css` contains semantic color tokens and responsive layouts. Nunito is self-hosted with its SIL Open Font License and sensible sans-serif fallbacks.

## Personalize before sharing

Edit `src/config.ts`:

- `FOUNDER_NAME`: replace `[Your name]`.
- `FOUNDER_BIO`: replace the clearly marked biography placeholder with your actual story.
- `FEEDBACK_FORM_URL`: set your Google Form's public HTTPS URL. When empty or invalid, the site displays “Feedback form coming soon.”

The founder placeholder note disappears automatically when both fields contain your own information. No credentials, testimonials, affiliations, or usage statistics are invented.

## Profile and local progress

The setup flow saves a nickname in `financepath.profile.v1`. This is a local profile, not authentication: no email, password, remote user record, or device sync exists. Returning profiles can resume from the dashboard. The assessment can be skipped with Beginner selected, or completed with a suggested level that the learner can override. Real signup requires a separately configured authentication service.

`src/progress.ts` validates and manages the single `financepath.progress.v1` localStorage record. Shared state is exposed by `src/ProgressContext.tsx` and `src/useProgress.ts`.

The record also stores `activityDays` as unique local-calendar dates and `readArticles` as the latest read timestamp per news ID. Existing records remain version 1; older completion timestamps migrate into learning days. A current streak can end today or yesterday; a missed intervening day breaks it. Article reads, lesson completions, lesson quiz submissions, and a completed level assessment count once per local day. Merely opening a page or changing a level does not count.

The record stores the explicitly chosen level (initially `null`), unique lesson completions with timestamps, quiz submissions with an `everCorrect` flag, and the latest completed assessment. Counts are derived from unique IDs, so retries and repeated completion cannot inflate progress. Marking a lesson complete does not require a correct quiz answer.

Reset clears lesson completions, quiz results, article-read records, and learning-day history while preserving level, profile, and assessment history. Invalid fields are ignored; unsupported schema versions become clean state. If storage fails, state stays usable in memory and a single persistent non-blocking message explains the limitation.

Progress is specific to the browser and site origin. It does not sync between devices, localhost, and the deployed site. Clearing browser data removes progress. In-progress assessment answers are retained while moving between questions, but do not persist until the assessment is submitted. There are no analytics.

## Automatic news and word help

`api/news.ts` is a read-only Vercel Node function. `server/news-service.ts` fetches a fixed allowlist of RSS feeds from BBC Business, CNBC, NPR, The New York Times Business, and Federal Reserve monetary releases. It parses XML with `fast-xml-parser`, rejects malformed/unsafe links and future-dated items, removes HTML and tracking parameters, deduplicates stories, and sorts by publication time. Upstream requests time out after 7 seconds. The server and CDN cache successful collections for 15 minutes; the open news page also refreshes every 15 minutes. No scheduled job, paid provider, credentials, or AI generation is required.

The feed is a rolling collection, not a historical archive. Day browsing uses the reader’s local date. If no story matches a selected day, the UI explicitly shows the latest available stories before that day. If one publisher fails, the available collection is marked partial. If all fail, a warm server may serve its previous collection; otherwise the dated, verified Oct 3, 2026 backup is visibly labeled. Publication dates never change to make an old article appear current.

Publisher excerpts remain short and link to full reporting. `src/data/news.ts` provides different reading guidance for each level and topic; these are educational explanations and questions, not automatic rewrites of full publisher articles. The original report stays at its source. The bundled backup contains source-reviewed level-specific briefings. To add broad licensed article rewrites or a complete archive later, use a licensed content provider and persistent storage.

Word help is off by default. Enabling it makes reading words deliberate clickable controls. Definitions can be closed with Escape or the close button, which returns focus to the word. Finance vocabulary is local; other selected words go through `/api/definition` to the [Wiktionary definition endpoint](https://www.mediawiki.org/wiki/Wikimedia_REST_API). The returned entry links to Wiktionary and its CC BY-SA 4.0 license. The proxy avoids browser cross-origin issues, validates single words, has a 6.5-second upstream timeout, and caches successful definitions. Failed lookups show an unavailable message rather than inventing a meaning. Lookup requests are aborted when superseded and cached in memory. Speech uses the browser’s optional speech synthesis and starts only after clicking Read aloud.

## Deploy to Vercel

1. Commit the project to your Git repository and push it to a Git host yourself. The initial delivery contains a local commit; it does not create or push a remote.
2. In Vercel, choose **Add New → Project**, select your repository, and import it.
3. Set **Framework Preset** to **Vite**, **Build Command** to `pnpm build`, and **Output Directory** to `dist`. Use Node.js 22.x or a supported newer LTS version. No environment variables are required.
4. Deploy. Test the homepage, then paste a detail route such as `/decoder/inflation` into a new tab and refresh it.

The committed `vercel.json` supplies a SPA fallback to `index.html` while excluding `/api/`, so React Router handles direct visits and the news and definition requests reach their functions. Vercel serves existing static files before the fallback. For another host, publish `dist/`, configure the SPA fallback, and deploy equivalent `/api/news` and `/api/definition` server endpoints. A purely static host will display the labeled backup instead of automatic news.

See [Vercel’s Vite documentation](https://vercel.com/docs/frameworks/frontend/vite) for the platform’s SPA deployment guidance.

Typography is served locally. The news server fetches publisher feeds; Word help sends only the chosen word to the Wiktionary. Educational sources and feedback links open externally; profile and progress are not transmitted to these services.

## Verification

Automated tests cover scoring boundaries, unique progress counting, incorrect-to-correct retries, reset retention, malformed/unsupported stored records, storage exceptions, lesson content integrity, local-day streak boundaries and migration, publisher feed validation, and partial/stale/offline fallbacks. Before publishing changes, run the checks above and inspect navigation, quizzes, storage persistence, and representative phone/tablet/desktop layouts.

## Market overview and public-launch policies

Headlines now interleaves publishers and supports source filtering. Each publisher contributes at most 12 recent items so high-volume outlets do not crowd out smaller feeds. Publisher headline links open the original article; a separate link opens FinancePath’s level-specific reading guidance.

The market panel loads TradingView’s official Symbol Overview iframe only after **Show market chart** is clicked. No API key is required. The three verified series are FOREX.com’s US 500, US 30, and US Tech 100 CFDs. They are explicitly labeled market proxies: these are not official cash index quotes, and Tech 100 is not the Nasdaq Composite. Pricing, trading hours, delays, and the selected chart range can differ from cash indexes. TradingView branding remains visible, with an external markets link if embedding is blocked.

The cross-origin frame is sandboxed; external scripts do not execute in FinancePath’s origin. Loading it sends browser/device information to TradingView and may involve their cookies; privacy and storage pages explain this choice. Hide chart unloads the frame but does not delete provider cookies. The former market API is removed; existing ignored local API credentials are unused. Reading guidance varies by level, and related news is context rather than proof of a price move. The news date filter does not change the chart range.

The `/legal/` pages cover privacy, terms, browser storage, pricing/refunds, sources/licenses, accessibility, and confirmed local-data deletion. They are visibly pre-launch drafts until `LEGAL_OPERATOR`, `LEGAL_CONTACT`, and `LEGAL_STATE` are completed and reviewed. Local-profile creation requires a 13+ statement and explicit storage choice; this does not replace children’s privacy review or parental consent where required. No advertising/analytics SDK or payment/email system is present. Nunito is self-hosted with its official SIL OFL notice. Deployment headers restrict parent scripts/connections to this origin, allow the TradingView widget frame, and set a no-referrer policy.

Read [LAUNCH-REVIEW.md](LAUNCH-REVIEW.md) before publishing. Publisher feed rights, market-data permissions, actual host logs/processors, accessibility, state-specific policy review, and operator contact details remain owner launch responsibilities. These pages do not guarantee legal compliance or prevent lawsuits.

The market panel includes distinct Beginner, Intermediate, and Advanced companion-led walkthroughs above the shared chart. Each has three selectable explanations, a hypothetical worked example, and a self-check with corrective feedback. Level changes reset the walkthrough and answer. News context includes the selected level’s reading guidance directly on the page; publisher links remain original sources. Examples are not generated from live widget prices and the self-check does not count toward a learning streak.

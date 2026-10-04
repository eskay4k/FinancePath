# FinancePath design

FinancePath is a friendly place to learn about money at any level. The updated direction takes inspiration from Duolingo’s approachable learning experience, using its own growing-money illustration and educational content.

## Tokens

- Leaf green `#398344`: actions and selected levels.
- Deep green `#286A33`: links and emphasis.
- Pale green `#EFF6E8`: supporting surfaces.
- White `#FFFFFF`: reading surfaces.
- Ink `#294333`: main text.
- Muted green `#637363`: secondary text.

Nunito is the single type family, with rounded bold headings and comfortable regular body text. Nunito is self-hosted with its SIL OFL notice and a sans-serif fallback. Body text is 16–18px, with generous line spacing.

## Layout and interaction

The landing page is a calm welcome with the original SVG money garden and one Get started action. Lesson content lives in the dashboard rather than competing for attention on the landing page. The intended journey is landing → profile setup → level assessment → dashboard. The current static MVP uses a clearly labeled browser-only nickname profile, not an online account.

The dashboard greets the learner, recommends the first unfinished lesson based on their level, shows the basics path, and provides progress and headline exploration. Assessment results lead back to the dashboard; skipping chooses Beginner. Every lesson remains available in any order. Returning profiles can resume their dashboard and revisit their level or edit their name.
Navigation names destinations in everyday language: Headlines, Money basics, Progress, About. Libraries retain searchable lesson cards; lessons retain readable explanations, vocabulary, quizzes, and sources. Green tokens and tactile button borders carry throughout the app.

Mobile stacks the two learning choices and provides large, full-width entry buttons. Native radio controls, semantic headings, visible keyboard focus, reduced motion, and existing progress behavior remain part of the experience. Streaks reflect recorded learning days. There are no points, locked lessons, or invented achievements.

## Level identity and daily learning

The score-based recommendation appears on the assessment result and the recommended radio option. It remains visible in dashboard level settings after a manual override. Choosing a level changes reading guidance, companion, and presentation together while preserving progress.

Beginner uses Pip, a friendly original sprout character, rounded Nunito headings, spacious controls, and tactile buttons. Intermediate uses Finn, an original fox, quieter borders and flatter controls. Advanced uses Sage, an original owl with glasses, restrained green surfaces and Georgia editorial headings. Green, white, content structure, focus behavior, and navigation stay shared.

Companion speech is user-triggered. Tips cycle when requested; audio can be stopped and ends on navigation. The daily learning calendar sits beside the basics path and shows real recorded activity. Current and best streaks are local to the browser.

Headlines is a separate real-news destination. Source, publication date, freshness, and the relationship between excerpts and reading guidance are visible. Word help is an optional reading tool rather than an always-active interruption.

Market charts use a green, optional TradingView embed above headlines. Label the FOREX.com CFD proxies clearly, retain provider attribution, and explain chart ranges at each learner level. Loading requires a deliberate click and the external markets link remains available.

Market teaching sits before the chart: Pip explains signs and time ranges; Finn guides aligned comparisons; Sage examines measurement and evidence. Three selectable steps avoid presenting the whole lesson at once. Each level includes its own practice example and feedback, while the shared chart stays mounted across level changes. Green and Nunito remain shared, with the restrained Advanced treatment.

# FinancePath pre-launch review

Updated October 4, 2026. United States scope; operator: Saad Khan, founder of FinancePath, based in Texas. Public contact: saadkxns@gmail.com. This is an implementation audit, not a legal clearance or a guarantee against litigation.

## Changes made

- Privacy, terms, storage/cookies, free pricing/refunds, source/license, and accessibility pages linked in footer.
- Explicit terms agreement and 13+ statement before email/password signup; no date of birth collected. This is not verifiable parental consent or a finding that the design is outside COPPA.
- Authenticated progress clearing and account deletion with password reauthentication are implemented. Account deletion cascades to its cloud learning record; the current account cache is removed. Other devices and provider backups are described separately in the privacy draft.
- Self-hosted Nunito and official SIL OFL notice. Original companion SVGs; Lucide ISC icons. No publisher images copied.
- Source links on article titles, attribution, short feed excerpts, and separate original reading guidance. No claim of partnership or publisher endorsement.
- Optional click-to-load TradingView iframe, with native attribution and an external fallback. Verified FOREX.com CFD series are explicitly labeled market proxies, not official cash index quotes. Level-specific guidance explains range and pricing differences; news context does not claim causation.
- No tracking SDK, advertising pixel, paid checkout, hidden fees, fake reviews, marketing email sender, or newsletter list was found in this build. The optional third-party chart has its own click-to-load privacy choice; FinancePath has no marketing unsubscribe flow. Adding these systems requires updating both behavior and policies first.
- Existing skip link, focus styles, keyboard controls, accessible character labels, reduced motion, retained; third-party chart accessibility remains provider controlled. Accessibility page does not claim WCAG certification.

## Required owner decisions before public launch

1. Operator, Texas location, and contact are configured from founder-provided details. No registered company, postal address, or professional credentials are claimed. Monitor saadkxns@gmail.com for privacy/support requests.
2. Have qualified U.S. counsel review these drafts, the relevant state law, the intended audience, and children’s privacy treatment. Animated characters and a 13+ checkbox alone do not settle COPPA classification. If children under 13 are intended users, build an appropriate consent/privacy design before launch.
3. Identify the actual hosting provider, operational log retention, processors, security controls, and incident/request procedures. Do not publish an invented retention schedule. Check deployment for extra analytics or cookies.
4. Clear public/commercial RSS use with each publisher. A public feed, attribution, or a 25-word excerpt does not establish legal permission or a safe-harbor word count. NYT and other publisher RSS terms may limit uses; consult current terms and secure rights as necessary. Disable unapproved feeds in server/news-service.ts. Do not bypass paywalls or use copied full articles/images.
5. Review TradingView’s current widget terms, data availability, privacy processing, and required attribution for the intended public deployment. Keep native branding and accurate CFD proxy labels. Exact official index quotes would require a separate authorized data source; these embeds do not grant rights to extract or redistribute data.
6. Run a deployment-specific security and accessibility audit, including assistive technology, contrast, keyboard/mobile navigation, and real provider responses. Do not equate a successful build with legal compliance or a complete accessibility audit.
7. Accounts and cloud sync now use Supabase, with Vercel hosting disclosed in the updated policies. Configure custom SMTP and verify confirmation/reset delivery before public registration. Supabase default mail only reaches project team members. Review processor agreements, retention, access, and operational procedures; update policies before payments, marketing email, analytics, ads, or additional services.

## Primary references

- FTC COPPA guidance: https://www.ftc.gov/business-guidance/resources/complying-coppa-frequently-asked-questions
- TradingView official widget and data availability: https://www.tradingview.com/widget-docs/widgets/charts/symbol-overview/, https://www.tradingview.com/widget-docs/faq/data/
- TradingView terms and privacy: https://www.tradingview.com/policies/, https://www.tradingview.com/privacy-policy/
- FRED S&P series notes explicitly reserve reproduction rights: https://fred.stlouisfed.org/series/SP500 (not used as an unlicensed data feed).
- Publisher feed/terms review entry points: https://www.cnbc.com/rss-feeds/, https://www.nytimes.com/services/xml/rss/index.html, https://www.npr.org/about-npr/138640251/terms-of-use, https://www.bbc.co.uk/usingthebbc/terms/
- Nunito license: public/fonts/Nunito-OFL.txt
- Wiktionary content: https://en.wiktionary.org/wiki/Wiktionary:Copyrights

# Premium Portal Section Roadmaps

This document turns the Sleep Hygiene portal from a collection of pages into a calm, useful product. Each section has one user promise, a small set of product behaviors, and a release gate. The first release stays device-first and educational; clinical review, live server validation, and payment validation remain later gates.

## Research principles

- **Today first:** Apple Health makes the current state and the next useful action visible before deeper history. The portal therefore opens with a Today dashboard and a single primary action.
- **Trends with context:** Oura combines trend charts with tags and a focused “spotlight” so users can connect a change with a behavior. The portal uses a seven-night review, explicit notes, and plain-language explanations rather than a mysterious score.
- **Low-friction tools:** Sleep Cycle makes a single sleep action configurable in a few taps. The portal keeps timing tools compact and usable without an account.
- **Content as a routine:** Calm and Headspace organize sleep content around the moment of use. The portal’s library is filtered, short, and connected to an action instead of being a document archive.
- **Privacy as a product surface:** Apple Health puts sharing and control in the user’s hands. The portal exposes local storage, export, deletion, online/offline state, and a review-before-handoff flow.

## 1. Today dashboard

**Promise:** “Tell me what matters tonight.”

**Current implementation:** progress ring, two actions, four-step route, empty state, device-first copy.

**Next roadmap:**

1. Persist a user-selected focus (`routine`, `schedule`, `environment`, or `understanding`) and use it to select the primary action.
2. Add a dismissible explanation beneath each recommendation: why it was chosen, what it uses, and how to change it.
3. Add a seven-day streak only after seven valid diary nights; never reward raw app opens.
4. Add “resume where you stopped” with the last tool, lesson, or diary row.

**Release gate:** a first-time user can choose one useful action in under 60 seconds, and a returning user can resume without scanning the whole page.

## 2. Smart tools

**Promise:** “Turn advice into a time or decision you can use tonight.”

**Current implementation:** wind-down cue, morning-light planner, sleep-opportunity calculator, with a link to the full tools area.

**Next roadmap:**

1. Add saved presets for weekday/weekend schedules.
2. Add a lightweight “use this tonight” confirmation that writes the chosen plan to the diary workspace.
3. Add a compact result explanation and an escape hatch for shift work, travel, or a different schedule.
4. Offer a local reminder time only after the user explicitly enables it.

**Release gate:** every output is understandable without clinical jargon, works offline, and explains that it is a planning aid rather than a diagnosis.

## 3. Diary and workspace

**Promise:** “Record only what helps you learn.”

**Current implementation:** checklist, seven-night diary, goal/plan field, local storage, optional account sync hook, export and deletion.

**Next roadmap:**

1. Add edit history for the last seven rows and an undo for accidental deletion.
2. Add optional contextual tags (late caffeine, alcohol, nap, travel, stress) inspired by Oura’s tag model, with no automatic medical inference.
3. Add an explicit local/synced badge beside every saved area.
4. Add import from the portal backup format with a preview and merge choice.

**Release gate:** a user can correct a mistake, understand where data lives, and export a readable record without an account.

## 4. Insights and weekly review

**Promise:** “See a pattern without being judged by a score.”

**Current implementation:** seven-night chart, nights logged, average quality, sleep window, consistency copy, and action plan.

**Next roadmap:**

1. Add a selectable comparison (quality vs. bedtime, or quality vs. wake time) only when enough data exists.
2. Use confidence language: “your entries suggest” and “not enough data yet.”
3. Let the user pin one insight to the Today dashboard.
4. Add a print-friendly review sheet for a clinician handoff.

**Release gate:** no trend appears with fewer than three relevant entries, and every interpretation states its data window and limits.

## 5. Questionnaires and reports

**Promise:** “Choose the right validated screen and understand the next step.”

**Current implementation:** PSQI, MEQ, IRLS, ESS, ISI, STOP-BANG, and GAPS tracks with integrity verification and result routes.

**Next roadmap:**

1. Add a track chooser that explains purpose, length, and what the result can and cannot say.
2. Add autosave and resume for incomplete questionnaires on the device.
3. Add a report view with score, band, item completion, interpretation limits, and next action.
4. Add version metadata and scoring fixtures to every track before any clinical release.

**Release gate:** questionnaire count, scoring, range, and interpretation are verified by automated checks; clinical copy still requires human review.

## 6. Learning library and resource atlas

**Promise:** “Learn one useful thing at the right moment.”

**Current implementation:** short bilingual cards, filters, progress state, visual summaries, foundations/tools/questionnaires atlas links.

**Next roadmap:**

1. Add provenance, reviewer, reviewed date, reading time, and “last updated” metadata.
2. Tag each lesson by moment: tonight, morning, this week, or discuss with a professional.
3. Add a small “try it now” action to every lesson.
4. Keep long-form material behind an intentional detail view so the portal stays scannable.

**Release gate:** each published card has an owner, source, review date, reading time, and one practical action.

## 7. Privacy, account, and offline/PWA

**Promise:** “The app works before sign-in, and you can see what happens to your data.”

**Current implementation:** local-first storage, export/delete controls, online/offline status, service-worker cache, install prompt, and account loading state.

**Next roadmap:**

1. Add backup import with schema version and a safe preview.
2. Add conflict states when server sync is introduced; never silently overwrite local data.
3. Keep the offline shell limited to safe, public content and never cache account or API responses.
4. Add a visible app version and data schema version to exported files.

**Release gate:** PWA integrity checks pass, private routes are excluded from the cache, and a user can export/delete without contacting support.

## 8. Clinician handoff and safety

**Promise:** “Bring a clear, bounded summary to a professional when you choose.”

**Current implementation:** JSON export, print view, safety panel, and explicit educational/no-diagnosis copy.

**Next roadmap:**

1. Add a human-readable preview before export.
2. Allow the user to select which nights, tags, and questionnaire reports to include.
3. Add expiry/revocation only when secure server sharing exists.
4. Maintain a separate safety copy review gate.

**Release gate:** no automatic clinician notification, diagnosis, or emergency promise; urgent guidance remains visible and localized.

## 9. Premium subscription path

**Promise:** “Pay for depth and continuity, never for basic safety.”

**Free foundation:** core education, basic tools, local diary, validated screens, export, and offline access.

**Potential paid value:** guided multi-week programs, richer comparisons, saved personalized plans, secure clinician sharing, integrations after consent, and editorial series.

**Roadmap:** instrument activation and retention first; define entitlements; add billing only after product analytics, privacy review, and server validation; provide a clear export and cancellation path.

**Release gate:** no paywall blocks safety content or data export, and no subscription claim is made until billing, entitlement recovery, and cancellation are tested on the real deployment.

## Refinement loop

For every section: ship one focused behavior, test keyboard/mobile/offline states, inspect the visual result at English and Persian widths, then refine copy and spacing. The quality bar is calm hierarchy, clear state, meaningful motion, and no invented clinical certainty.

## Research links

- Apple Health overview and sharing: <https://support.apple.com/guide/iphone/get-started-with-health-iphcae7451f3/26/ios/26>, <https://support.apple.com/guide/iphone/share-your-health-data-iph5ede58c3d/27/ios/27>
- Oura Trends, tags, and readiness: <https://support.ouraring.com/hc/articles/360055983614-Using-Trends>, <https://support.ouraring.com/hc/en-us/articles/360038676993-Using-Tags>, <https://support.ouraring.com/hc/en-us/articles/360025589793-Readiness-Score>
- Sleep Cycle smart alarm: <https://support.sleepcycle.com/hc/en-us/articles/7858323091356-What-is-the-Smart-Alarm-Clock>
- Calm sleep content: <https://support.calm.com/hc/en-us/articles/360016390734-Using-Calm-s-Content-to-Fall-Asleep>
- Headspace sleep content: <https://help.headspace.com/hc/en-us/articles/360009450353-What-is-Sleep-by-Headspace>

# Sleep Hygiene Portal: MVP to premium health app

## Product promise

KRISM Sleep Hygiene should feel like a calm, evidence-informed companion: one clear next step, private by default, and useful before a user ever creates an account.

## Phase 0 — current MVP foundation

- Bilingual portal with responsive PWA shell.
- PSQI, MEQ, IRLS, ESS, ISI, STOP-BANG, and GAPS assessment tracks.
- Device-first diary, checklist, learning progress, export, and account-sync hooks.
- Smart tools for wind-down timing, morning light, and sleep opportunity.

Exit criteria: every questionnaire has source-checked scoring, clear interpretation limits, and a tested result route.

## Phase 1 — premium core (next)

- App-like Today dashboard with one recommended action.
- Real offline cache and install experience.
- Local reminder scheduling through the service worker.
- Diary trend charts for sleep window, quality, and consistency.
- Explicit loading, empty, offline, and error states.
- Mobile-first information architecture that reduces scroll and prioritizes the next action.

Exit criteria: a new user can complete an action in under 60 seconds, return offline, and understand what to do next without reading the whole portal.

## Phase 2 — trusted personalization

- Evidence-backed rules for choosing the next tool or questionnaire.
- Weekly review with pattern language and no diagnostic overreach.
- Personal goals with pause, edit, and completion states.
- Secure account sync with visible version history and conflict recovery.
- Clinician handoff package with review-before-export and configurable fields.

Exit criteria: users can see why a recommendation was made, change it, and export a useful summary safely.

## Phase 3 — clinical-grade quality

- Automated scoring tests for every questionnaire and edge case.
- Accessibility audit across English, Persian, keyboard, screen reader, and reduced motion.
- Privacy threat model, retention controls, audit logs, and consent language.
- Monitoring for API failures, delivery failures, and sync conflicts.
- Human review of educational copy and safety escalation language.

Exit criteria: release checklist signed off for content, clinical interpretation, privacy, accessibility, and operational reliability.

## Phase 4 — premium ecosystem

- Curated resource atlas with provenance, review dates, and content owners.
- Clinician portal or secure share links with expiry and revocation.
- Optional integrations with wearable data only after consent and data minimization review.
- Research mode with de-identified, opt-in data collection.
- Localization system for Persian editorial review, not only translation.

## Design rules

1. One primary action per screen.
2. Calm motion, meaningful feedback, and reduced-motion support.
3. Never imply diagnosis from a self-report score.
4. Make data ownership visible: what is local, what is synced, and what can be deleted.
5. Every recommendation must have an explanation and an escape hatch.
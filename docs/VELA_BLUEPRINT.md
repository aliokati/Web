# VELA — Premium Recovery Intelligence Platform

## Product blueprint

**Positioning:** A premium, privacy-first recovery intelligence platform for individuals, employers, care teams, hospitality groups, and high-performance organizations. Vela helps people understand the relationship between sleep, energy, habits, stress, movement, environment, and health—then turns that understanding into small, useful actions.

**Tagline:** *Wake clearer. Live deeper.*

**Enterprise line:** *Human performance, handled with care.*

**Core promise:** Vela does not make people manage a spreadsheet of wellness data. It translates signals into a daily story, a few high-confidence recommendations, and a long-term view of what actually helps—while giving organizations aggregated, privacy-safe visibility into wellbeing without exposing individual health data.

**Design ambition:** Apple-inspired in restraint, typography, motion, hierarchy, and product storytelling—while remaining an original health product with its own visual identity and interaction model. Every surface should feel considered enough for a boardroom, calm enough for a bedroom, and clear enough for clinical or HR review.

---

## 1. The product idea

Most sleep apps are either:

- a score with no explanation;
- a diary with no synthesis;
- a dashboard overloaded with charts; or
- a content library that does not adapt to the person.

Vela unifies these into a single loop:

```text
Notice → Understand → Choose → Practice → Reflect → Notice again
```

The central object is not a score. It is the **Recovery Narrative**: a short, human explanation of what the system observed, what may have influenced it, and what one or two actions are most likely to help today.

### The signature concept: the Daylight-to-Dream Loop

Vela connects the full 24-hour cycle rather than treating sleep as an isolated night-time event.

```text
Morning light / movement / caffeine / meals / stress
                 ↓
       daytime energy + wind-down readiness
                 ↓
       sleep onset / continuity / restoration
                 ↓
       morning state + next-day choices
```

This creates a differentiated product thesis: **better nights are designed during the day.**

---

## 2. Product principles

### Calm over compulsive

The app should reduce health anxiety, not create a new source of it. No red-alert gamification, no streak shame, no “perfect sleep” language, and no single number presented as the truth.

### Explain before optimizing

Every insight should answer: “What changed?”, “How sure are we?”, and “What can I do?”

### Fewer actions, better actions

The home screen should usually contain one primary recommendation and two optional suggestions—not a checklist of twelve habits.

### Trends over verdicts

Use rolling baselines, ranges, and patterns. A difficult night is information, not failure.

### Progressive disclosure

The first layer is calm and legible. Deeper layers reveal the data, methodology, comparisons, and controls for users who want them.

### Human agency

Automation is opt-in. The user can correct, annotate, hide, export, or delete any data point.

### Clinical humility

Vela supports self-awareness and healthy routines. It does not diagnose, replace medical care, or infer conditions from consumer data.

---

## 3. Information architecture

Use a five-part tab bar with a persistent action affordance:

| Tab | Role | Default question answered |
|---|---|---|
| **Today** | Daily command center | “What matters today?” |
| **Sleep** | Nightly detail and sleep tools | “How did I sleep and what shaped it?” |
| **Health** | Whole-person signals and trackers | “How is my body and mind trending?” |
| **Learn** | Personalized education and experiments | “What should I understand or try?” |
| **You** | Profile, devices, privacy, settings | “How is Vela configured for me?” |

The center action is a soft, expandable **Log** button. It opens a radial sheet for a fast entry: mood, energy, caffeine, stress, symptom, nap, medication, movement, meal, or custom note.

### Navigation behavior

- The tab bar remains visible on primary screens and gently fades on immersive tools.
- Every chart can be swiped into an expanded “focus mode.”
- Every insight can be saved to a personal “Why it matters” collection.
- Global search accepts natural language: “show nights after late coffee,” “when do I feel best,” “what changed this month?”
- Deep links preserve context, e.g. opening a sleep insight from a notification returns to the exact chart and explanation.

---

## 4. Home screen: Today

Today should feel like a beautifully composed morning briefing rather than a dashboard.

### Above the fold

1. **Time-aware greeting**
   - “Good morning, Maya”
   - contextual weather/light line if enabled
2. **Recovery halo**
   - a soft, animated ring showing the relationship between sleep, energy, and readiness
   - never framed as a grade
3. **Recovery Narrative card**
   - two-sentence interpretation
   - confidence label: “high confidence,” “emerging pattern,” or “not enough data”
4. **One recommended action**
   - “Get 10 minutes of outdoor light before 9:30”
   - duration, rationale, and a one-tap “Done”
5. **Quick log row**
   - mood, energy, stress, caffeine, note

### Example narrative

> You slept 42 minutes less than your recent average, but your sleep continuity stayed strong. Your recent notes suggest late work sessions are more strongly related to short sleep than evening exercise. Tonight, try a 20-minute “landing zone” before bed.

### Today modules

- **Sleep last night** — bedtime, wake time, continuity, subjective restfulness
- **Body signals** — resting heart rate, HRV trend, respiratory rate, temperature deviation when available
- **Energy arc** — predicted high/low-energy windows shown as a gentle timeline
- **Today’s rhythm** — light, movement, meals, caffeine, wind-down
- **Small experiment** — one active behavioral experiment, if the user has one
- **Journal reflection** — a single prompt that adapts to the day

### Home screen states

| State | Tone | Primary action |
|---|---|---|
| First week | Reassuring | Complete a 30-second baseline check-in |
| Good recovery | Celebratory but quiet | Protect the rhythm |
| Low recovery | Non-judgmental | Choose a minimum viable day |
| Missing data | Helpful | Log manually or connect a source |
| High uncertainty | Transparent | Keep observing; avoid over-interpreting |

---

## 5. Core feature system

### A. Sleep

#### Night view

- bedtime, sleep onset estimate, wake time, time in bed
- sleep continuity and awakenings
- sleep stages only when a compatible device provides them
- subjective restfulness and dream note
- environmental overlay: noise, temperature, light, air quality if available
- “what helped / what got in the way” reflection
- bedtime and wake consistency view
- sleep debt shown as a range, not a punishment counter

#### Sleep tools

- adaptive wind-down routine builder
- bedtime calculator with a consistent wake-time anchor
- gentle sleep timer for audio
- breathing and downshift exercises
- body scan, progressive muscle relaxation, cognitive shuffle
- “middle-of-the-night” mode with low-light UI and minimal choices
- worry parking lot: capture a thought and return to sleep
- sunrise alarm with optional smart-window behavior
- jet-lag and shift-work planning
- nap planner based on time of day and target duration
- bedroom environment checklist
- snoring / noise notes when manually reported or supported by an integration

#### Sleep diary

Fast, low-friction entries:

- lights out
- estimated time to fall asleep
- nighttime awakenings
- final wake
- out-of-bed time
- restfulness
- unusual factors

The diary should support “tap once, refine later.” Do not force a long form at 7 a.m.

### B. Health

#### Trackers

Built-in trackers should be modular, optional, and configurable:

- mood
- energy
- stress
- focus
- movement
- daylight exposure
- caffeine and alcohol
- hydration
- meals and late eating
- symptoms
- pain
- medication and supplements
- menstrual cycle and reproductive health, if the user opts in
- illness and recovery
- social connection
- work intensity
- screen time
- breathing practice
- gratitude or positive moments

#### Health overview

Present trends as four lenses:

1. **Rhythm** — consistency and timing
2. **Load** — stress, activity, illness, and cognitive demand
3. **Recovery** — sleep, energy, rest, and autonomic signals
4. **Context** — environment, travel, cycle, schedule, and life events

#### Custom tracker builder

Users can create a tracker with:

- name and icon
- unit or scale
- time-of-day behavior
- reminder rule
- visibility
- privacy classification
- correlation eligibility
- export behavior

### C. Diaries and reflection

The diary is a private, searchable layer—not a social feed.

Modes:

- **60-second check-in** — energy, mood, stress, restfulness
- **Free journal** — rich text, voice transcription, photo, tags
- **Sleep note** — dream, worry, wake reason, environment
- **Event note** — travel, illness, deadline, celebration, schedule change
- **Weekly reflection** — what helped, what drained, what to repeat
- **Monthly review** — patterns, experiments, and questions for a clinician

Useful diary affordances:

- “Add this to tonight’s context”
- automatic time and location only when permitted
- emotional tone is optional and processed transparently
- journal content is never used for health scoring without explicit permission
- one-tap redaction and delete

### D. Overviews and trends

#### Trend canvas

A touch-first data exploration surface:

- day / week / month / quarter / year
- layered signals with color-blind-safe patterns
- compare two variables, e.g. caffeine timing vs. sleep onset
- annotate events directly on the timeline
- “show nights like this”
- confidence band and sample size on every inferred relationship
- baseline editing and travel/illness exclusion
- explainable “why this may be related” drawer

#### Insight types

- **Pattern** — “Your sleep is more consistent on days with morning light.”
- **Change** — “Your wake time shifted 34 minutes later over three weeks.”
- **Opportunity** — “The smallest likely lever is moving caffeine earlier.”
- **Question** — “Is your low energy tied more to short sleep or high workload?”
- **Celebration** — “Your wind-down routine has been consistent for 8 of 10 nights.”

Never present correlation as causation. Language should be calibrated: *associated with*, *may be related to*, *worth observing*, *not enough data*.

### E. Learn

Learn should feel like an editorial magazine, not a course catalog.

Content types:

- 60-second cards
- 5-minute explainers
- audio sessions
- illustrated guides
- myth vs. reality cards
- “try this tonight” routines
- expert Q&As
- personalized learning paths
- clinician conversation prep
- family / partner sleep guides

Content should adapt to the user's current question, not push endless consumption.

Example path: **Why am I waking at 3 a.m.?** → circadian timing → alcohol and sleep continuity → stress arousal → what to observe for seven nights → when to seek professional help.

### F. Experiments

The most distinctive long-term feature is the **Personal Lab**.

Users can run one small experiment at a time:

- hypothesis
- duration
- intervention
- success measure
- constraints
- check-in prompts
- stop / pause control
- review at the end

Example:

```text
Hypothesis: Earlier caffeine will reduce sleep-onset friction.
Try: No caffeine after 13:00 for 10 days.
Measure: Time to fall asleep + next-morning energy.
Success: Improvement on at least 6 of 10 nights.
```

Vela automatically handles baseline comparison, missing days, travel, illness, and confidence. It never implies scientific certainty from a personal experiment.

---

## 6. Signature experiences

### 1. The Recovery Halo

A visual summary composed of three translucent arcs:

- **Rest** — last night and recent continuity
- **Rhythm** — timing consistency
- **Capacity** — how much load the day may comfortably hold

The arcs breathe slowly when the app is open. They do not spin, flash, or reward repeated checking. Tapping an arc opens the explanation behind it.

### 2. The Evening Landing Zone

A 20–60 minute guided space that helps the user transition from active day to sleep opportunity.

It can include:

- dimming interface
- unfinished-thought capture
- tomorrow preview
- breathing or audio
- device wind-down suggestions
- room check
- “I am already in bed” shortcut

The sequence is flexible; users can skip every step.

### 3. Morning Light Map

A contextual view combining local sunrise, the user's wake time, outdoor-light logs, and sleep timing. It gives a simple action window rather than a perfect schedule.

### 4. The Minimum Viable Day

When recovery is low, Vela offers a lighter plan:

- one stabilizing action
- one thing to postpone
- one gentle movement option
- one evening protection

The product adapts to the user's capacity instead of making them feel behind.

### 5. The Annual Health Story

An elegant, private, exportable review that shows:

- major rhythm shifts
- helpful routines
- recurring disruption contexts
- experiments completed
- journal themes chosen by the user
- questions worth bringing to a professional

It should feel like a thoughtful personal archive, not a gamified year-end recap.

---

## 7. Key screen blueprint

### Today

```text
┌──────────────────────────────────────┐
│ Good morning, Maya              ⋯    │
│ Tuesday, 14 May · Berlin              │
│                                      │
│          [ animated halo ]           │
│       steady night · low load        │
│                                      │
│ Recovery narrative                    │
│ You slept less, but more continuously │
│ than your recent average.             │
│                                      │
│ TODAY'S ONE THING                     │
│ Get outside for 10 min before 09:30   │
│ [ Start ]                             │
│                                      │
│ Sleep  ·  Energy  ·  Log  ·  Notes    │
└──────────────────────────────────────┘
```

### Sleep detail

```text
┌──────────────────────────────────────┐
│ Sleep                         Share  │
│ 7h 18m in bed · 6h 54m asleep        │
│                                      │
│       ─── sleep timeline ───         │
│ 23:10          03:00           07:04 │
│                                      │
│ Restfulness  4/5   Continuity  86%    │
│                                      │
│ What shaped this night?              │
│ [ Late meal ] [ Work stress ] [ None ]│
│                                      │
│ See the pattern                      ›│
└──────────────────────────────────────┘
```

### Trend canvas

```text
┌──────────────────────────────────────┐
│ Trends                        Filter │
│ Last 30 days                         │
│                                      │
│ Sleep onset       ─╱╲──╱──╲─         │
│ Caffeine time     ─╲──╱╲──╱─         │
│                                      │
│ Associated pattern                   │
│ Later caffeine appears alongside     │
│ longer sleep onset in your data.     │
│ Confidence: emerging · n=18          │
│                                      │
│ [ Change variable ] [ Add note ]     │
└──────────────────────────────────────┘
```

### Middle-of-the-night mode

- near-black background
- oversized, low-contrast time
- no charts, scores, or notifications
- “quiet audio,” “breathing,” “worry note,” and “return to bed” only
- automatically exits when the user turns on normal brightness

---

## 8. Visual language

### Brand character

Vela should feel like:

- quiet confidence
- luminous but grounded
- scientific without being clinical
- warm at night, clear in the morning
- premium without feeling expensive or exclusive

### Palette

Use a light/dark adaptive system rather than a fixed dark “sleep app” aesthetic.

**Core neutrals**

- Porcelain: `#F7F7F4`
- Fog: `#E9EAE5`
- Graphite: `#1C1D1B`
- Night: `#101312`

**Signal colors**

- Dawn gold: `#F2C66D`
- Sea glass: `#8FD5C1`
- Evening blue: `#7D9CE8`
- Lavender: `#B9A5E8`
- Coral: `#EA8E7A`

Use signal colors as accents, not as large saturated fills. Every state must also be understandable by position, label, shape, or pattern.

### Typography

- Display: a high-contrast editorial serif or humanist display face for occasional emotional moments
- UI: a neutral sans with strong numeric clarity
- Data: tabular numerals and generous tracking
- Body: large line-height, short measure, low cognitive load

Suggested hierarchy:

```text
Display  42/48
Title    28/34
Section  20/26
Body     17/25
Label    13/17
Data     tabular, 20–40 depending on prominence
```

### Surfaces

- Use solid surfaces for clarity and a restrained translucent material for elevated sheets.
- Blur should communicate depth, never obscure text.
- Cards should not become a grid of identical rounded rectangles; use composition, whitespace, and typography to create hierarchy.
- Corner radii: 14 px for controls, 22 px for cards, 32 px for immersive modules.
- Shadows are soft, wide, and low-opacity; prefer border and tonal separation.

### Iconography

- thin, rounded, monoline icons
- icons are paired with labels in high-stakes or unfamiliar flows
- use custom “rhythm” marks for sleep phases, light, load, and recovery
- never rely on moon imagery for every sleep concept; use time, texture, and light as broader metaphors

---

## 9. Motion and animation

Motion is part of the product's emotional regulation system.

### Principles

- slow enough to feel calm, fast enough to feel responsive
- movement should explain hierarchy, continuity, or cause and effect
- no looping animation that competes with reading
- respect Reduce Motion, Reduce Transparency, and system animation settings

### Signature animations

#### Morning reveal

The Today screen opens like dawn: a warm gradient moves 8–12% across the background over 600 ms, while the halo resolves from a soft blur into a stable state.

#### Timeline breathing

Sleep timeline segments use a barely perceptible 2–3% scale breathing effect only when focused. Unfocused charts remain still.

#### Insight transition

When a user taps a pattern, the related chart line lifts from the overview and expands into the detail canvas, preserving spatial continuity.

#### Completion

Completed actions settle into place with a short, tactile compression and a quiet glow—never confetti.

#### Evening dim

At the start of Landing Zone, interface contrast lowers gradually over 1.2 seconds and active colors shift toward amber and midnight blue.

### Motion tokens

```text
Micro:     120–180 ms, ease-out
Standard:  240–360 ms, ease-in-out
Reveal:    500–800 ms, spring or cubic-bezier
Ambient:   8–14 s, very low amplitude
```

---

## 10. Interaction patterns

### Logging

- default to one-tap or one-slider logging
- allow voice and lock-screen logging
- show a “saved” confirmation without blocking the flow
- preserve the last-used values but make them easy to correct
- support batch edits in the timeline

### Charts

- tap for exact value
- long press to scrub
- pinch to zoom only when necessary
- swipe between related signals
- always show units, date range, sample size, and missing-data treatment
- label notable events directly on the chart

### Notifications

Notification categories:

- gentle cue
- active experiment prompt
- bedtime / wake anchor
- data quality request
- safety / care escalation

Each category has separate opt-in controls. Default behavior is sparse and personalized.

### Widgets and surfaces

- Lock Screen: next gentle action, sleep window, or wind-down shortcut
- Home Screen: Recovery Halo, quick log, sleep summary, experiment progress
- watch / wearable: morning check-in, breathing, quick log, sleep start marker
- car / desktop: optional “landing zone” handoff
- smart home: optional lighting, temperature, and sound routines

---

## 11. Intelligence layer

### Insight engine

The insight engine should combine:

- user-entered data
- device measurements
- schedule and context
- personalized baselines
- uncertainty estimates
- user feedback on whether an insight was useful

It should use a layered model:

1. **Descriptive:** what happened
2. **Associative:** what often appears alongside it
3. **Actionable:** what small experiment may be worth trying
4. **Safety-aware:** when not to infer and when to suggest professional support

### AI coach: “Lumen”

An optional conversational layer with strict boundaries.

Lumen can:

- summarize the user's own data
- help prepare an experiment
- turn a vague goal into a small routine
- explain a chart in plain language
- draft questions for a clinician
- guide a breathing or wind-down session

Lumen should not:

- diagnose
- prescribe medication or supplements
- make emergency decisions
- infer sensitive conditions from weak signals
- pressure the user into a streak or paid feature

Every AI response exposes “Why am I seeing this?” and “What data did you use?”

### Confidence language

```text
High confidence       repeated, consistent pattern with enough data
Moderate confidence   promising pattern with some uncertainty
Emerging pattern      early signal; keep observing
No conclusion         insufficient or conflicting data
```

---

## 12. Integrations and data model

### Integration categories

- wearable and phone motion data
- heart rate and HRV
- temperature and respiratory data
- smart rings and watches
- smart alarm / sleep environment devices
- calendar and travel context
- weather and sunrise data
- health records only where legally and technically appropriate

Each integration is independently permissioned. The user can choose whether a source is used for display, insights, or both.

### Canonical event model

```text
Event {
  id
  type: sleep | mood | energy | caffeine | movement | symptom | note | ...
  startAt
  endAt?
  value?
  unit?
  source: manual | device | imported
  confidence?
  contextTags[]
  createdAt
  editedAt
  privacyClass
}
```

### Data principles

- raw data remains accessible
- derived values are labeled as derived
- corrections are versioned
- missing data is not silently filled
- time zones and travel are first-class
- export in human-readable and machine-readable formats
- deletion is complete and understandable

---

## 13. Privacy, trust, and safety

Trust is part of the product experience, not a settings-page footnote.

### Required trust features

- plain-language permission center
- per-source controls
- private-by-default journal
- on-device processing where feasible
- encryption in transit and at rest
- clear retention controls
- full export and delete
- no selling of personal health data
- transparent model/data use disclosure
- audit log for connected services and exports
- optional passcode / biometric lock

### Health safety layer

Include calm, contextual guidance for:

- persistent severe sleep disruption
- dangerous sleepiness
- breathing or gasping concerns
- acute mental-health distress
- concerning symptoms entered repeatedly

The app should recommend appropriate professional support without over-diagnosing or using alarming language. Emergency guidance should be clearly separated from normal coaching.

---

## 14. Accessibility and inclusion

- WCAG 2.2 AA target for all core flows
- dynamic type through large accessibility sizes
- full screen-reader labels and chart summaries
- Reduce Motion and Reduce Transparency support
- high-contrast mode
- color-independent chart encoding
- one-handed reach zones
- offline access for logging and wind-down tools
- low-light mode with no bright white flashes
- support for shift workers, parents, chronic conditions, disability, travel, and irregular schedules
- language that does not assume a conventional 9–5 lifestyle

Do not treat one ideal sleep schedule as universal. Let the user define anchors, constraints, and their own meaning of a “good day.”

---

## 15. Onboarding

### First-run sequence

1. Choose the user's primary intention: sleep, energy, stress, routine, or understanding patterns.
2. Set constraints: work schedule, shift work, caregiving, travel, accessibility.
3. Choose data sources and permissions one at a time.
4. Complete a 30-second baseline check-in.
5. Pick one starting behavior or allow Vela to recommend one.
6. Explain the Recovery Narrative and how it learns.
7. Set notification boundaries.

### Avoid

- requesting every permission on one screen
- pretending the app can personalize before it has data
- showing a low score during onboarding
- making the user construct a full routine before seeing value

### First-week experience

The first seven days should emphasize observing and building trust:

- no aggressive trend conclusions
- daily prompt under 30 seconds
- one optional learning card per day
- day-seven “what we know so far” review

---

## 16. Design-system component inventory

### Foundations

- color tokens
- typography tokens
- spacing scale
- radii and elevation
- motion tokens
- icon grid
- haptics map

### Navigation

- tab bar
- top bar
- segmented control
- filter chips
- search
- context breadcrumb

### Data display

- Recovery Halo
- metric tile
- range meter
- rhythm timeline
- sleep hypnogram
- trend chart
- correlation view
- annotated event rail
- confidence badge
- data-source badge

### Input

- quick log button
- slider with verbal labels
- time picker
- date range picker
- tag selector
- note composer
- voice entry
- experiment builder

### Feedback

- insight card
- calm alert
- empty state
- uncertainty state
- permission explanation
- completion state
- care guidance card

Every component needs light, dark, large-text, reduced-motion, empty, loading, error, and low-connectivity states.

---

## 17. Business model guardrails

Recommended model:

- free core logging, Today view, basic sleep diary, and foundational education
- paid tier for advanced trend exploration, experiments, automation, and long-term archive tools
- hardware integrations remain optional and never required for meaningful value
- no ads in health contexts
- no paywall on safety information, data export, or deletion
- no manipulative streak mechanics

The premium experience should sell depth and continuity—not anxiety relief.

---

## 18. Success metrics

### User value

- percentage of users who can explain one personal sleep pattern after 14 days
- weekly completion of at least one useful reflection
- self-reported confidence in making a small routine adjustment
- experiment completion and usefulness rating
- reduction in notification dismissals over time

### Product quality

- time to first meaningful insight
- logging completion time
- correction rate for imported data
- chart comprehension in usability testing
- accessibility task completion
- percentage of AI responses with visible data provenance

### Trust and safety

- export and delete success rate
- permission comprehension score
- false-positive insight rate
- safety escalation precision
- user-reported anxiety or compulsive-checking signals

Avoid optimizing primarily for daily opens. A healthy product may be used less when the user is doing well.

---

## 19. Roadmap

### Phase 1 — Core calm loop

- Today
- manual sleep diary
- mood / energy / stress logging
- Recovery Narrative v1
- bedtime and wake anchor
- wind-down tool
- basic trend canvas
- privacy center

### Phase 2 — Connected intelligence

- wearable integrations
- environment context
- Personal Lab experiments
- adaptive notifications
- Morning Light Map
- advanced sleep detail
- lock-screen and watch experiences

### Phase 3 — Whole-health system

- richer symptom and cycle support
- travel and shift-work modes
- annual health story
- clinician conversation export
- Lumen conversational coach
- household / partner tools with explicit consent

### Phase 4 — Ambient recovery ecosystem

- smart-home routines
- adaptive audio and light
- privacy-preserving research participation
- API / partner ecosystem
- population insights only in de-identified, consented form

---

## 20. The visual north star

If the product is working, a user should feel this sequence:

1. **Seen** — “This reflects my actual life, not an idealized schedule.”
2. **Oriented** — “I understand what changed.”
3. **Capable** — “There is one small thing I can do.”
4. **Unpressured** — “I am not being judged by a score.”
5. **Curious** — “I want to learn what helps me over time.”

Vela should look like a premium Apple-era product experience—clear, cinematic, tactile, and emotionally restrained—while its true differentiation comes from the health model: context-aware, explainable, privacy-first, and centered on the user's lived recovery rather than a single metric.

### Recommended next design deliverables

1. Brand moodboard and visual exploration
2. Tokenized design system in Figma
3. Clickable prototype for Today, Sleep, Trends, and Evening Landing Zone
4. 7-day onboarding and data-permission prototype
5. Motion study for the Recovery Halo and chart transitions
6. Data-confidence and safety content review
7. Usability testing with ordinary sleepers, shift workers, parents, and users with chronic conditions

---

## 21. Premium enterprise edition

Vela Enterprise is not a corporate dashboard bolted onto a consumer app. It is a separate operating layer with the same human-centered product quality, rigorous privacy boundaries, and a visual language that can stand beside premium HR, benefits, and clinical products.

### Enterprise product architecture

```text
Vela Personal
      │ consented connection
      ▼
Vela Enterprise Identity + Policy Layer
      │ de-identified aggregation only
      ▼
Vela Organization Intelligence
      │ role-specific views
      ├── Executive wellbeing overview
      ├── People / benefits console
      ├── Coach / clinician workspace
      ├── Program manager workspace
      └── Technical administration
```

The individual always owns the personal experience. An organization receives only the minimum aggregated insight required for its stated purpose, with suppression rules that prevent re-identification in small groups.

### Enterprise editions

#### Vela Workplace

For employers, benefits teams, and distributed organizations.

- organization-level wellbeing trends
- sleep education programs
- anonymous pulse check-ins
- shift-work and travel programs
- team-level aggregate views with minimum cohort thresholds
- manager education without individual surveillance
- benefit utilization and engagement analytics
- configurable campaigns and learning paths
- exportable, privacy-safe reports for quarterly business reviews

#### Vela Care

For clinics, occupational health teams, and care programs.

- consent-based care-team sharing
- patient-owned summaries
- clinician conversation prep
- longitudinal sleep and symptom overview
- structured notes and annotations
- configurable clinical thresholds reviewed by qualified professionals
- referral and follow-up workflows
- audit trail for every shared item

#### Vela Performance

For elite teams, hospitality, aviation, and high-performance environments.

- travel and time-zone planning
- schedule-aware recovery windows
- roster-level aggregate readiness
- protected privacy zones for sensitive data
- team routines and environmental programs
- fatigue-risk education and escalation workflows
- offline and low-connectivity support

### Enterprise navigation

The enterprise web console uses a restrained three-column layout:

```text
┌──────────────┬──────────────────────────────┬──────────────────┐
│ Workspace    │ Main analysis canvas         │ Context drawer   │
│              │                              │                  │
│ Overview     │ Cohort wellbeing trend       │ Definition       │
│ Programs     │ Sleep rhythm by region       │ Data freshness   │
│ Cohorts      │ Participation funnel         │ Privacy rule     │
│ Insights     │ Program outcomes             │ Export / share   │
│ Reports      │                              │                  │
│ Admin        │                              │                  │
└──────────────┴──────────────────────────────┴──────────────────┘
```

The enterprise console should feel closer to a premium financial or operations product than a generic HR admin panel: dense where necessary, spacious where possible, and always explicit about definitions and data boundaries.

### Role-based workspaces

| Role | Can see | Cannot see by default |
|---|---|---|
| Executive | aggregated organization trends, program outcomes, risk themes | individual records, raw health signals |
| People / benefits lead | cohort participation, content performance, aggregate trends | identifiable individual health data |
| Manager | team-level program participation when threshold is met | personal sleep, symptoms, journal, device data |
| Coach / clinician | explicitly shared participant data | anything outside the consent scope |
| Program manager | campaigns, learning paths, experiments, engagement | raw individual health data |
| Security admin | identity, access, audit, retention controls | health content unless separately authorized |
| Billing admin | plan, invoices, entitlements | health content and analytics |

### Enterprise administration

- SAML 2.0 SSO
- OIDC support
- SCIM provisioning and deprovisioning
- role-based access control
- custom roles with least-privilege templates
- multi-region organization support
- domain verification
- approved device and session policies
- configurable session timeout
- IP allowlists for high-security environments
- audit log export
- data retention policies
- legal hold workflow where applicable
- custom consent and program language
- branded program spaces without changing the core Vela identity
- sandbox environment for implementation teams
- API keys scoped by capability and environment
- webhook events for program and identity lifecycle changes

### Privacy-safe analytics

Enterprise analytics must make privacy visible inside the interface:

- minimum cohort thresholds, e.g. suppress groups under a configured size
- no individual-level drill-down from aggregate charts
- privacy-budget or noise controls for sensitive aggregate reporting
- visible data freshness and sample size
- explicit distinction between participation and health outcomes
- “why this view is safe” explanation in every report
- automatic redaction of free-text and journal content
- separation of user consent from employer program enrollment
- report previews that show exactly what will be exported

### Enterprise insight language

Replace performance surveillance language with program language.

```text
Avoid:  “Your team is underperforming.”
Use:    “The cohort shows a sustained shift in sleep timing; consider a schedule-support intervention.”

Avoid:  “High-risk employees.”
Use:    “A privacy-safe aggregate pattern may warrant additional support resources.”

Avoid:  “Low readiness.”
Use:    “The selected cohort reports lower recovery capacity this week.”
```

### Implementation experience

Enterprise onboarding should be concierge-level:

1. Discovery workshop and use-case definition
2. Privacy impact assessment
3. Identity and data-source mapping
4. Sandbox configuration
5. Pilot cohort launch
6. Admin and coach enablement
7. Executive readout template
8. Full rollout and 30/60/90-day review

Each customer receives an implementation workspace, launch checklist, governance guide, and a named success partner.

### Premium service model

#### Signature

For individuals and small teams:

- advanced insights and experiments
- premium audio and learning collection
- long-term health story
- expanded integrations
- priority support

#### Professional

For clinics, coaches, and specialist programs:

- care-team tools
- consent workflows
- shared summaries
- program templates
- API access
- staff roles and audit history

#### Enterprise

For organizations:

- SSO / SCIM
- dedicated implementation
- custom policy controls
- enterprise analytics
- multi-region support
- SLA and uptime commitment
- security review package
- custom reporting
- dedicated success manager

Avoid publishing a simplistic per-seat price as the primary enterprise story. Price by scope, privacy requirements, support model, data volume, and program complexity.

### Security and compliance posture

The enterprise product should be designed toward:

- SOC 2 Type II
- ISO 27001-aligned controls
- GDPR and UK GDPR support
- regional data residency options where required
- HIPAA-ready architecture only where the product, contracts, and operating model genuinely support it
- formal incident response and breach notification procedures
- vendor risk and subprocessors register
- annual penetration testing
- disaster recovery and business continuity plan
- documented recovery point and recovery time objectives
- secure software development lifecycle
- encryption key management and secrets rotation
- employee access reviews and privileged-access controls

These are product requirements as much as infrastructure requirements: the UI must expose the organization's privacy, consent, retention, and access posture in understandable language.

### Enterprise design language

Premium enterprise does not mean adding gradients, gold, or dense data walls. It means:

- immaculate spacing and alignment
- confident typography
- purposeful information density
- fewer but better charts
- executive-level summaries with drill-down when warranted
- a visible sense of control and provenance
- shared visual DNA between the personal app and admin console

Use a two-mode system:

**Human mode:** warm, spacious, emotionally intelligent, low-pressure.

**Operations mode:** precise, high-density, evidence-labeled, policy-aware.

Both modes share the same color foundations, typography, iconography, motion principles, and trust language.

### Enterprise motion rules

- no ambient animation in analytics tables
- charts animate only on first load or when filtering
- state transitions preserve context and selection
- audit and permission changes use explicit confirmation states
- destructive or irreversible operations use a deliberate two-step flow
- live data refresh is indicated by a subtle timestamp, not a distracting pulse
- reduced-motion mode is a first-class enterprise setting

### Enterprise KPIs

Measure organizational value without encouraging surveillance:

- program activation rate
- weekly meaningful engagement
- completion of education pathways
- self-reported usefulness
- aggregate sleep-rhythm stability
- reduction in avoidable schedule friction
- manager and participant trust score
- consent comprehension
- data export and deletion success
- privacy incident rate
- time to launch
- admin time saved
- renewal and expansion by program value, not by lock-in

Do not make individual health scores, manager rankings, or employee surveillance metrics the default success measures.

---

## 22. Premium launch package

The first enterprise-ready release should ship with a deliberately narrow, excellent surface area:

### Customer-facing product

- Vela Today
- Sleep and Recovery Narrative
- Personal Lab
- Morning Light Map
- Evening Landing Zone
- private journal and export
- premium education library
- connected device framework

### Enterprise product

- organization overview
- programs and campaigns
- aggregate trends with privacy thresholds
- role-based access
- SSO / SCIM
- consent center
- audit log
- report builder
- admin settings
- implementation sandbox

### Brand package

- refined identity system
- editorial photography and illustration direction
- premium product demo film
- enterprise sales deck
- security and privacy brief
- implementation playbook
- executive report template
- product principles handbook

### Quality bar

Do not ship the enterprise edition until these are true:

- every metric has a definition and source
- every insight has confidence and data freshness
- every organization view has an explicit privacy rule
- every role sees only what it needs
- every export can be previewed before delivery
- every major flow works with keyboard, screen reader, and reduced motion
- every sensitive action is auditable
- every customer can leave with their data in a usable format

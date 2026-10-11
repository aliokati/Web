# VELA implementation roadmap

Source of truth: `docs/VELA_BLUEPRINT.md`, retrieved from the earlier task `Design sleep health app blueprint`.

## Product loop

VELA follows **Notice → Understand → Choose → Practice → Reflect**. The current portal is the first working slice of that loop:

- **Notice:** the VELA quick log stores mood, energy, stress, caffeine, and an optional note on-device.
- **Understand:** the recovery narrative turns recent check-ins into a calibrated story with an explicit confidence level.
- **Choose:** Personal Lab offers three bounded experiments instead of an endless task list.
- **Practice:** an experiment has a daily check-in and visible progress.
- **Reflect:** the existing diary, weekly review, assessment history, and export controls remain the durable reflection layer.

## Build sequence

1. **Foundation (implemented):** VELA shell, Today/Sleep/Health/Learn/You navigation, persistent quick-log sheet, recovery narrative, Personal Lab, data export/restore/delete integration, local-first behavior.
2. **Sleep intelligence:** connect the sleep diary to Sleep detail, calculate bedtime/wake consistency and sleep-opportunity ranges, add middle-of-night mode and gentle wind-down state.
3. **Health lenses:** add Rhythm, Load, Recovery, and Context cards from the existing diary and quick-log records; allow custom local trackers with clear privacy controls.
4. **Trends and explanations:** add week/month views, compare two signals, sample size and uncertainty copy, annotations, and a relationship drawer that explains correlation without causal claims.
5. **Learn and practice:** map the existing learning library to personalized paths, “try tonight” actions, audio-ready lessons, and clinician-prep exports.
6. **Account continuity:** preserve the local-first model while adding conflict-safe server sync, version history, and explicit merge choices. Server validation remains a later release gate.
7. **Premium polish:** adaptive light/dark surfaces, refined motion, reduced-motion behavior, keyboard and screen-reader QA, install/update UX, and performance budgets.

## Guardrails

- Recovery language is descriptive and uncertainty-aware; it does not diagnose.
- Journal text is never used in a score without an explicit future opt-in.
- Every new record is exportable and deletable.
- The shell remains useful without an account or network connection.
- Clinical review and server validation remain outside this implementation pass per the product direction.
## Public and private layers

The website is intentionally a quiet invitation, not the entire application. `/[locale]/sleep-hygiene` presents the premium proposition, the three-step loop, data principles, and a clear entry point. `/[locale]/sleep-hygiene/app` contains the full VELA workspace, its tools, local-first records, sync controls, reports, and experiments. The installable PWA starts at the private app route and the service worker caches both the invitation and app shell.

# KRISM Website

Astro website with a lightweight, schema-driven content manager.

## Public experience

The public site is organized around three audiences: people seeking sleep-health guidance, sleep professionals, and researchers or students. The homepage connects those audiences to KRISM's research, education, public-health and professional-network programs using the same bilingual content records managed through the admin panel.

### KRISM Sleep Check

`/sleep-check` and `/fa/sleep-check` provide an adult-only, bilingual educational conversation covering six broad sleep-disorder areas: insomnia, sleep-related breathing, hypersomnolence, circadian rhythm, parasomnia, and sleep-related movement concerns.

The tool is deliberately non-diagnostic. It uses deterministic routing, includes urgent safety stops, stores no answers, and links people to public education and an appropriate next step. It does not reproduce or score clinical questionnaires. A qualified sleep clinician must review the routing copy and local emergency wording before public production launch.

## Local setup

1. Install dependencies with `npm install`.
2. Copy `.env.example` to `.env` and replace every placeholder.
3. Start the development server with `npm run dev -- --background`.
4. Open `/admin/login` to access the content manager.

Generate a session secret with Node:

```sh
node -e "console.log(require('node:crypto').randomBytes(48).toString('base64url'))"
```

## Roles

- `admin`: read, create, edit and delete
- `editor`: read, create and edit
- `viewer`: read-only

Accounts are configured through environment variables. Unconfigured editor or viewer accounts are unavailable.

## Content storage

Content is stored as formatted JSON in `content/`. Writes are validated against `src/content-manager/registry.ts`, serialized per section, written through a temporary file and backed up under `content/.history/`.

### Bilingual content

English is the required source language. Fields marked `localized` in the registry can also store a Persian override under `translations.fa`. The content manager exposes separate English and Persian tabs; shared values such as slugs, dates, URLs and publishing flags are edited only once.

Persian public pages read the same records through a localized collection. A record appears publicly in Persian only after both its content status and translation status are set to `published`; required Persian fields must be complete first. Draft and review records remain available in the admin panel but never appear on public listing, detail, or sitemap routes.

### Publishing workflow

1. Create the English source record and keep `status` set to `draft`.
2. Add the Persian translation in the Persian editor tab.
3. Move each side through `review` after editorial and clinical checks.
4. Record reviewer and review date, then set the appropriate status to `published`.
5. Use `archived` to withdraw a record without deleting its history.

Do not publish people in the professional directory until `publicConsent` has been confirmed. Research-board profiles additionally require `profileConsent`. Events can use the internal registration system or an external registration URL; external mode requires a valid URL.

Set `KRISM_CONTENT_DIR` to a persistent writable directory in production. If omitted, the application uses `<working-directory>/content`.

This storage model is designed for one Node application instance on persistent storage. Do not run multiple writable instances against independent local disks. For horizontally scaled or serverless deployment, replace the store with shared durable storage.

## Production

The project uses Astro's standalone Node adapter:

```sh
npm run build
node ./dist/server/entry.mjs
```

Deploy the `dist/` output and the `content/` directory. Configure all secrets through the host environment and serve the application only over HTTPS.

Set the `PUBLIC_CONTACT_*` values for verified public contact channels. Contact inquiries are submitted to the private form system and are not sent to third parties. Set `TRUST_PROXY_HEADERS=true` only behind a trusted reverse proxy that overwrites client forwarding headers.

### Contact and event submissions

Contact inquiries and internal event registrations are stored as private JSON records outside the public web root. Configure `KRISM_SUBMISSIONS_DIR` as persistent, access-controlled storage in production. The administrator-only `/admin/submissions` page supports review, deletion and CSV export. Editors and viewers cannot access personal submissions.

`FORM_RETENTION_DAYS` defaults to 90 days. Expired records are removed opportunistically when a new submission is saved. Treat exported CSV files as sensitive personal data and delete them when no longer needed. The forms include same-origin enforcement, basic rate limiting, honeypot spam filtering, explicit consent and length validation; production deployments should also add encrypted backups and host-level monitoring.

Before launch, replace `site` in `astro.config.mjs` with the final canonical production origin if it changes, and complete a named clinical/editorial review of Sleep Check and the published health articles.

## Content API safeguards

- signed, expiring HTTP-only session cookies
- same-origin checks on every mutation
- role checks in middleware and endpoints
- login throttling
- schema and URL protocol validation
- conflict detection with content revisions
- atomic writes and rolling backups
- no-store and no-index headers for admin routes

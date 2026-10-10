# KRISM content manager

Open `/en/admin/cms` or `/fa/admin/cms`. On the local development server, create the single owner's password (at least 12 characters). New account setup is disabled in production. The password is hashed; it is never included in content exports.

## Editing

- Choose a collection, search for an entry, and open it. Articles and professional profiles have different editing fields.
- Use English and Persian tabs for the two language versions. Enable **Publish the Persian translation** when it is ready. Otherwise Persian public pages use the English content. Empty optional Persian fields fall back to English.
- Paragraphs are separated with blank lines. List items use one line per item. Content is plain text, so pasted scripts or HTML cannot execute.
- Choose an existing website image or upload JPG, PNG, or WebP (up to 5 MB / 25 megapixels). Uploads are resized, converted to WebP, and stripped of original metadata.
- **Save & publish** writes to the server and updates public pages immediately. Existing page addresses stay fixed to preserve links. Use **Duplicate** for a new page with a different address.
- **History** retains the last 100 changes across collections, including deleted records. **Restore** returns a record to its state before the selected change. Restoration is itself recorded and can be undone.
- **Download backup** exports the content and history as JSON. Image files and the private owner account are separate and are not included in this content-only export.
- **Password** changes the owner password and ends other sessions. Signing in lasts up to eight hours. Unsaved edits stay in the open tab if a session expires; signing in again returns to them.

The manager covers learning resources, sleep-health articles, board profiles, research, publications, events, professional network entries, and organization entries. The scientific-reference directory, contact details, About copy, navigation, and questionnaire scoring remain managed in their existing source files.

## Storage and deployment

This implementation is for a single Node application with durable local disk, matching the current project. It does not require a database service. Do not deploy it to an ephemeral filesystem or independent replicas without replacing the file store with shared transactional storage.

`KRISM_CMS_DATA_DIR` sets the private data directory. The default is `data/cms` under the project:

- `owner.json`: password hash and session-signing secret. Never put this under `public/` or commit it.
- `content.json`: the current publication snapshot and recent history.
- `content.previous.json`: the snapshot before the latest successful change.
- `assets/`: optimized uploaded images.
- `write.lock`: temporary cross-process protection against simultaneous writes.

All writes use a temporary file and atomic replacement. Conflicting editor windows receive an error instead of silently overwriting a newer revision. If a process is killed during a write, a stale `write.lock` can remain. Stop all KRISM application processes, verify that no write is running, and remove only that lock before restarting.

Before deployment, finish owner setup locally. Transfer the complete private data directory through the hosting provider's secure file-transfer channel, outside the public web root. Configure the deployed Node app to use that durable directory and set `KRISM_SITE_URL` to its exact public HTTPS origin. Set `NEXT_PUBLIC_SITE_URL` too if sitemap generation is required. Preserve the data directory during deployments and back it up separately from application code.

To recover from a damaged current content file: stop the app, copy the current file aside, validate `content.previous.json`, then copy that snapshot to `content.json` and restart. A downloaded content backup has the same schema and can be restored the same way. Keep the corresponding `assets/` directory when moving a backup so image references remain valid. The owner file is not changed by content recovery.

If the owner password is lost, stop the app, retain a private backup of `owner.json`, remove that file, start the app locally in development mode, and create a new owner password. Existing content remains intact. Transfer the new owner file securely when deploying. There is no publicly accessible password-reset endpoint.

## Verification

The content routes validate size, record shape, page-address uniqueness, safe links, and image formats. API writes require an authenticated owner session and a matching origin. Cookies are HTTP-only, SameSite Strict, and Secure in production; password changes rotate the signing secret. Admin pages are excluded from indexing and blocked from embedding in frames.

`KRISM_BUILD_DIR` optionally selects a separate build directory for verification. Leave it unset for normal `npm run dev`, `npm run build`, and `npm start` usage.

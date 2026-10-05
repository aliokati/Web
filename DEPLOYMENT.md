# Deployment

The Astro source lives in `website/` and requires a Node.js runtime because the
content manager, authentication, APIs, contact form, and event-registration
system use server-side rendering.

Runtime requirements:

- Node.js 22.12 or newer
- `npm ci` followed by `npm run build`
- Start the standalone server from `website/dist/server/entry.mjs`
- Persistent writable storage for managed content and private submissions

The domain must use these nameservers:

- `clns1.iranhost.com`
- `clns2.iranhost.com`

The canonical domain is `https://krism-society.com`. Point its DNS to the
Node-capable host, issue a TLS certificate there, and redirect the former
`krisms.ir` hostname to the canonical domain after the new deployment is live.

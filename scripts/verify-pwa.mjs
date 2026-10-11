import fs from 'node:fs';
const sw=fs.readFileSync('public/sw.js','utf8');
const manifest=fs.readFileSync('src/app/manifest.ts','utf8');
const required=[
 ['versioned cache',sw.includes('krism-sleep-v4')],
 ['offline navigation fallback',sw.includes("event.request.mode === 'navigate'")&&sw.includes("'/en/sleep-hygiene'")&&sw.includes("'/fa/sleep-hygiene'")],
 ['update activation',sw.includes('self.skipWaiting()')&&sw.includes('self.clients.claim()')],
 ['API exclusion',sw.includes("url.pathname.startsWith('/api/')")],
 ['standalone display',manifest.includes("display: 'standalone'")],
 ['sleep shortcut',manifest.includes('/en/sleep-hygiene')]
];
const failures=required.filter(([,ok])=>!ok).map(([name])=>name);
if(failures.length){console.error('PWA integrity failed:',failures.join(', '));process.exit(1)}
console.log(`PWA integrity passed (${required.length} checks).`);

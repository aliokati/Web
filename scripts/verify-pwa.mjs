import fs from 'node:fs';

const read=path=>fs.readFileSync(path,'utf8');
const pwaWorker=read('public/pwa-sw.js');
const manifest=JSON.parse(read('public/pwa-manifest.webmanifest'));
const appPage=read('src/app/[locale]/sleep-hygiene/app/page.tsx');
const middleware=read('src/middleware.ts');
const layout=read('src/app/[locale]/layout.tsx');
const rootWorker=read('public/sw.js');
const checks=[
  ['standalone manifest',manifest.display==='standalone'&&manifest.start_url==='/'&&manifest.scope==='/'],
  ['app-owned manifest',appPage.includes("manifest:'/pwa-manifest.webmanifest'" )],
  ['app route is real',appPage.includes('SleepHygieneApp')&&!appPage.includes('redirect(')],
  ['subdomain routing',middleware.includes("hostname==='pwa.krism-society.com'")&&middleware.includes("/en/sleep-hygiene/app")],
  ['isolated service worker',pwaWorker.includes("const CACHE='krism-sleep-app-v1'")&&pwaWorker.includes("url.pathname.startsWith('/api/')")],
  ['no authenticated HTML cache',pwaWorker.includes("event.request.mode==='navigate'")&&pwaWorker.includes("event.respondWith(fetch(event.request).catch")],
  ['legacy worker retires itself',rootWorker.includes('self.registration.unregister()')],
  ['no global PWA registration',!layout.includes('PwaRegistration')],
];
const failures=checks.filter(([,ok])=>!ok).map(([name])=>name);
if(failures.length){console.error('PWA integrity failed:',failures.join(', '));process.exit(1)}
console.log(`PWA integrity passed (${checks.length} checks)`);

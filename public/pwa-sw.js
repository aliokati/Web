const CACHE='krism-sleep-app-v1';
const PUBLIC_ASSETS=['/pwa-manifest.webmanifest','/images/krism-logo.png'];

self.addEventListener('install',event=>event.waitUntil(caches.open(CACHE).then(cache=>cache.addAll(PUBLIC_ASSETS))));
self.addEventListener('activate',event=>event.waitUntil(caches.keys().then(keys=>Promise.all(keys.filter(key=>key.startsWith('krism-sleep-app-')&&key!==CACHE).map(key=>caches.delete(key)))).then(()=>self.clients.claim())));
self.addEventListener('fetch',event=>{
  const url=new URL(event.request.url);
  if(event.request.method!=='GET'||url.origin!==location.origin||url.pathname.startsWith('/api/'))return;
  if(event.request.mode==='navigate'){
    event.respondWith(fetch(event.request).catch(()=>new Response('<!doctype html><html><body style="font-family:system-ui;background:#f6f9fa;color:#172c3d;padding:2rem"><h1>KRISM Sleep Hygiene</h1><p>You are offline</p></body></html>',{headers:{'Content-Type':'text/html; charset=utf-8'}})));
    return;
  }
  if(url.pathname.startsWith('/_next/static/')||PUBLIC_ASSETS.includes(url.pathname)){
    event.respondWith(caches.match(event.request).then(hit=>hit||fetch(event.request).then(response=>{if(response.ok&&response.type==='basic')caches.open(CACHE).then(cache=>cache.put(event.request,response.clone()));return response})));
  }
});

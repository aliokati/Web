const CACHE = 'krism-sleep-v2';
const CORE = ['/en/sleep-hygiene', '/fa/sleep-hygiene', '/en/sleep-hygiene/tools', '/fa/sleep-hygiene/tools', '/images/krism-logo.png'];
self.addEventListener('install', event => event.waitUntil(caches.open(CACHE).then(cache => cache.addAll(CORE))));
self.addEventListener('activate', event => event.waitUntil(caches.keys().then(keys => Promise.all(keys.filter(key => key !== CACHE).map(key => caches.delete(key))))));
self.addEventListener('fetch', event => {
  const url = new URL(event.request.url);
  if (event.request.method !== 'GET' || url.origin !== location.origin || url.pathname.startsWith('/api/') || url.pathname.includes('/admin/')) return;
  event.respondWith(fetch(event.request).then(response => {
    if (response.ok && response.type === 'basic' && ['document','style','script','image','font'].includes(event.request.destination)) caches.open(CACHE).then(cache => cache.put(event.request, response.clone()));
    return response;
  }).catch(() => caches.match(event.request).then(hit => hit || (event.request.mode === 'navigate' ? caches.match('/en/sleep-hygiene') : Response.error()))));
});

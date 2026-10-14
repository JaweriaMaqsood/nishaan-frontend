// Rehnuma service worker: sirf page ko cache karta hai (offline pe purana page khulta hai). API kabhi cache nahi hoti.
const CACHE = 'rehnuma-v1';
self.addEventListener('install', (e) => { self.skipWaiting(); e.waitUntil(caches.open(CACHE).then((c) => c.addAll(['/'])).catch(() => {})); });
self.addEventListener('activate', (e) => { e.waitUntil(caches.keys().then((ks) => Promise.all(ks.filter((k) => k !== CACHE).map((k) => caches.delete(k)))).then(() => self.clients.claim())); });
self.addEventListener('fetch', (e) => {
  const r = e.request;
  if (r.method !== 'GET' || new URL(r.url).origin !== location.origin) return;
  if (r.mode === 'navigate') {
    e.respondWith(fetch(r).then((res) => { const copy = res.clone(); caches.open(CACHE).then((c) => c.put('/', copy)); return res; }).catch(() => caches.match('/')));
  }
});

const CACHE = 'fr-quiz-v8';
const BASE = new URL('.', self.location).href;
const ASSETS = [
  BASE,
  BASE + 'index.html',
  BASE + 'french-verbs-quiz.html',
  BASE + 'french-participes-quiz.html',
  BASE + 'french-verbs-cheatsheet.html',
  BASE + 'french-verbs-learn.html',
  BASE + 'french-participes-learn.html',
  BASE + 'french-vocab-learn.html',
  BASE + 'french-vocab-quiz.html',
  BASE + 'french-grammaire.html',
  BASE + 'french-grammaire-quiz.html',
  BASE + 'french-expressions.html',
  BASE + 'verbs.json',
  BASE + 'participes.json',
  BASE + 'vocabulaire.json',
  BASE + 'grammaire.json',
  BASE + 'grammaire-quiz.json',
  BASE + 'expressions.json',
  BASE + 'manifest.json',
  BASE + 'icons/icon-192.png',
  BASE + 'icons/icon-512.png',
];

self.addEventListener('install', e => {
  e.waitUntil(
    caches.open(CACHE).then(c => c.addAll(ASSETS)).then(() => self.skipWaiting())
  );
});

self.addEventListener('activate', e => {
  e.waitUntil(
    caches.keys().then(keys =>
      Promise.all(keys.filter(k => k !== CACHE).map(k => caches.delete(k)))
    ).then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', e => {
  if (e.request.method !== 'GET') return;
  e.respondWith(
    caches.match(e.request).then(cached => {
      if (cached) return cached;
      return fetch(e.request).then(res => {
        if (res.ok) {
          const clone = res.clone();
          caches.open(CACHE).then(c => c.put(e.request, clone));
        }
        return res;
      });
    })
  );
});

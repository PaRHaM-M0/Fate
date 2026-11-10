/* Fate — Service Worker
   پوستهٔ برنامه هنگام نصب یک‌جا کش می‌شود تا اپ کاملاً آفلاین باز شود.
   درخواست‌های بیرونی (سرویس‌های رندوم آنلاین) هرگز کش نمی‌شوند. */
const CACHE_VERSION = 'fate-v1.0.8';
const STATIC_CACHE = CACHE_VERSION + '-static';

const CORE_URLS = [
  './',
  './index.html',
  './manifest.json',
  './icons/icon-192.png',
  './icons/icon-512.png',
  './icons/icon-maskable-192.png',
  './icons/icon-maskable-512.png',
  './icons/apple-touch-icon.png',
  './icons/favicon-64.png'
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(STATIC_CACHE)
      .then((cache) => cache.addAll(CORE_URLS))
      .then(() => self.skipWaiting())
  );
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys()
      .then((keys) => Promise.all(
        keys.filter((k) => k !== STATIC_CACHE).map((k) => caches.delete(k))
      ))
      .then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', (event) => {
  const req = event.request;
  if (req.method !== 'GET') return;

  const url = new URL(req.url);
  if (url.origin !== self.location.origin) return;   // APIهای رندوم: مستقیم به شبکه

  // ناوبری: اول شبکه (برای گرفتن نسخهٔ جدید)، در نبود شبکه از کش
  if (req.mode === 'navigate') {
    event.respondWith(
      fetch(req)
        .then((res) => {
          const copy = res.clone();
          caches.open(STATIC_CACHE).then((c) => c.put('./index.html', copy));
          return res;
        })
        .catch(() => caches.match('./index.html'))
    );
    return;
  }

  // بقیهٔ فایل‌های خودی: اول کش، بعد شبکه (و به‌روزرسانی کش)
  event.respondWith(
    caches.match(req).then((hit) => {
      if (hit) return hit;
      return fetch(req).then((res) => {
        if (res && res.ok) {
          const copy = res.clone();
          caches.open(STATIC_CACHE).then((c) => c.put(req, copy));
        }
        return res;
      });
    })
  );
});

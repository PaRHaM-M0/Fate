/* Fate — Service Worker
   پوستهٔ برنامه هنگام نصب یک‌جا کش می‌شود تا اپ کاملاً آفلاین باز شود.
   درخواست‌های بیرونی (سرویس‌های رندوم آنلاین) هرگز کش نمی‌شوند. */
const CACHE_VERSION = 'fate-v1.6.1';
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
  './icons/favicon-64.png',
  './CREDITS.md',
  './assets/art/hero-fate.jpg',
  './assets/art/poster-frame.jpg',
  './assets/art/tarot-cloth.jpg',
  './assets/art/litho-cloth.jpg',
  './assets/art/gt-table.jpg',
  './assets/art/rune-yggdrasil.jpg',
  './assets/art/mo-thangka.jpg',
  './assets/art/trigram-qian.jpg',
  './assets/art/trigram-kun.jpg',
  './assets/art/trigram-zhen.jpg',
  './assets/art/trigram-xun.jpg',
  './assets/art/trigram-li.jpg',
  './assets/art/trigram-kan.jpg',
  './assets/art/trigram-gen.jpg',
  './assets/art/trigram-dui.jpg',
  './assets/art/art-dhyani.jpg',
  './assets/art/art-valleys.jpg',
  './assets/art/art-samsara.jpg',
  './assets/art/art-loshu.jpg',
  './assets/cards/lenormand/01-rider.webp',
  './assets/cards/lenormand/02-clover.webp',
  './assets/cards/lenormand/03-ship.webp',
  './assets/cards/lenormand/04-house.webp',
  './assets/cards/lenormand/05-tree.webp',
  './assets/cards/lenormand/06-clouds.webp',
  './assets/cards/lenormand/07-snake.webp',
  './assets/cards/lenormand/08-coffin.webp',
  './assets/cards/lenormand/09-bouquet.webp',
  './assets/cards/lenormand/10-scythe.webp',
  './assets/cards/lenormand/11-whip.webp',
  './assets/cards/lenormand/12-birds.webp',
  './assets/cards/lenormand/13-child.webp',
  './assets/cards/lenormand/14-fox.webp',
  './assets/cards/lenormand/15-bear.webp',
  './assets/cards/lenormand/16-stars.webp',
  './assets/cards/lenormand/17-stork.webp',
  './assets/cards/lenormand/18-dog.webp',
  './assets/cards/lenormand/19-tower.webp',
  './assets/cards/lenormand/20-garden.webp',
  './assets/cards/lenormand/21-mountain.webp',
  './assets/cards/lenormand/22-crossroads.webp',
  './assets/cards/lenormand/23-mice.webp',
  './assets/cards/lenormand/24-heart.webp',
  './assets/cards/lenormand/25-ring.webp',
  './assets/cards/lenormand/26-book.webp',
  './assets/cards/lenormand/27-letter.webp',
  './assets/cards/lenormand/28-man.webp',
  './assets/cards/lenormand/29-woman.webp',
  './assets/cards/lenormand/30-lily.webp',
  './assets/cards/lenormand/31-sun.webp',
  './assets/cards/lenormand/32-moon.webp',
  './assets/cards/lenormand/33-key.webp',
  './assets/cards/lenormand/34-fish.webp',
  './assets/cards/lenormand/35-anchor.webp',
  './assets/cards/lenormand/36-cross.webp',
  './assets/cards/lenormand/back.webp',
  './assets/cards/tarot/cups-01.webp',
  './assets/cards/tarot/cups-02.webp',
  './assets/cards/tarot/cups-03.webp',
  './assets/cards/tarot/cups-04.webp',
  './assets/cards/tarot/cups-05.webp',
  './assets/cards/tarot/cups-06.webp',
  './assets/cards/tarot/cups-07.webp',
  './assets/cards/tarot/cups-08.webp',
  './assets/cards/tarot/cups-09.webp',
  './assets/cards/tarot/cups-10.webp',
  './assets/cards/tarot/cups-11.webp',
  './assets/cards/tarot/cups-12.webp',
  './assets/cards/tarot/cups-13.webp',
  './assets/cards/tarot/cups-14.webp',
  './assets/cards/tarot/major-00.webp',
  './assets/cards/tarot/major-01.webp',
  './assets/cards/tarot/major-02.webp',
  './assets/cards/tarot/major-03.webp',
  './assets/cards/tarot/major-04.webp',
  './assets/cards/tarot/major-05.webp',
  './assets/cards/tarot/major-06.webp',
  './assets/cards/tarot/major-07.webp',
  './assets/cards/tarot/major-08.webp',
  './assets/cards/tarot/major-09.webp',
  './assets/cards/tarot/major-10.webp',
  './assets/cards/tarot/major-11.webp',
  './assets/cards/tarot/major-12.webp',
  './assets/cards/tarot/major-13.webp',
  './assets/cards/tarot/major-14.webp',
  './assets/cards/tarot/major-15.webp',
  './assets/cards/tarot/major-16.webp',
  './assets/cards/tarot/major-17.webp',
  './assets/cards/tarot/major-18.webp',
  './assets/cards/tarot/major-19.webp',
  './assets/cards/tarot/major-20.webp',
  './assets/cards/tarot/major-21.webp',
  './assets/cards/tarot/pentacles-01.webp',
  './assets/cards/tarot/pentacles-02.webp',
  './assets/cards/tarot/pentacles-03.webp',
  './assets/cards/tarot/pentacles-04.webp',
  './assets/cards/tarot/pentacles-05.webp',
  './assets/cards/tarot/pentacles-06.webp',
  './assets/cards/tarot/pentacles-07.webp',
  './assets/cards/tarot/pentacles-08.webp',
  './assets/cards/tarot/pentacles-09.webp',
  './assets/cards/tarot/pentacles-10.webp',
  './assets/cards/tarot/pentacles-11.webp',
  './assets/cards/tarot/pentacles-12.webp',
  './assets/cards/tarot/pentacles-13.webp',
  './assets/cards/tarot/pentacles-14.webp',
  './assets/cards/tarot/swords-01.webp',
  './assets/cards/tarot/swords-02.webp',
  './assets/cards/tarot/swords-03.webp',
  './assets/cards/tarot/swords-04.webp',
  './assets/cards/tarot/swords-05.webp',
  './assets/cards/tarot/swords-06.webp',
  './assets/cards/tarot/swords-07.webp',
  './assets/cards/tarot/swords-08.webp',
  './assets/cards/tarot/swords-09.webp',
  './assets/cards/tarot/swords-10.webp',
  './assets/cards/tarot/swords-11.webp',
  './assets/cards/tarot/swords-12.webp',
  './assets/cards/tarot/swords-13.webp',
  './assets/cards/tarot/swords-14.webp',
  './assets/cards/tarot/wands-01.webp',
  './assets/cards/tarot/wands-02.webp',
  './assets/cards/tarot/wands-03.webp',
  './assets/cards/tarot/wands-04.webp',
  './assets/cards/tarot/wands-05.webp',
  './assets/cards/tarot/wands-06.webp',
  './assets/cards/tarot/wands-07.webp',
  './assets/cards/tarot/wands-08.webp',
  './assets/cards/tarot/wands-09.webp',
  './assets/cards/tarot/wands-10.webp',
  './assets/cards/tarot/wands-11.webp',
  './assets/cards/tarot/wands-12.webp',
  './assets/cards/tarot/wands-13.webp',
  './assets/cards/tarot/wands-14.webp',
  './assets/textures/bone.jpg',
  './assets/textures/wood.jpg',
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

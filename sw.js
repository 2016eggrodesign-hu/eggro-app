/* Service worker kecil: hanya menyimpan kerangka (ikon + halaman pembungkus). Data aplikasi selalu diambil langsung dari server. */
var V = 'eggro-v1', FILE = ['./', './index.html', './manifest.webmanifest', './icon-192.png'];
self.addEventListener('install', function (e) { e.waitUntil(caches.open(V).then(function (c) { return c.addAll(FILE); }).then(function () { return self.skipWaiting(); })); });
self.addEventListener('activate', function (e) { e.waitUntil(caches.keys().then(function (k) { return Promise.all(k.filter(function (n) { return n !== V; }).map(function (n) { return caches.delete(n); })); }).then(function () { return self.clients.claim(); })); });
self.addEventListener('fetch', function (e) {
  if (e.request.method !== 'GET' || new URL(e.request.url).origin !== location.origin) return;
  e.respondWith(fetch(e.request).then(function (r) { var c = r.clone(); caches.open(V).then(function (ca) { ca.put(e.request, c); }); return r; }).catch(function () { return caches.match(e.request, { ignoreSearch: true }); }));
});

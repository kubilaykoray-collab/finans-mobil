// Uygulama kabuğunu önbelleğe alır; finans verisi burada değil, telefonun yerel deposunda durur.
const SURUM = 'finans-v1';
const DOSYALAR = ['./', 'index.html', 'manifest.webmanifest', 'ikon.svg', 'ikon-192.png', 'ikon-512.png'];

self.addEventListener('install', e => {
  e.waitUntil(caches.open(SURUM).then(c => c.addAll(DOSYALAR)).then(() => self.skipWaiting()));
});

self.addEventListener('activate', e => {
  e.waitUntil(caches.keys()
    .then(ks => Promise.all(ks.filter(k => k !== SURUM).map(k => caches.delete(k))))
    .then(() => self.clients.claim()));
});

// Önce ağ (güncel sürüm), ağ yoksa önbellek
self.addEventListener('fetch', e => {
  if (e.request.method !== 'GET') return;
  e.respondWith(
    fetch(e.request)
      .then(r => { const k = r.clone(); caches.open(SURUM).then(c => c.put(e.request, k)); return r; })
      .catch(() => caches.match(e.request).then(r => r || caches.match('index.html')))
  );
});

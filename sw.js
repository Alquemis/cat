// Service Worker — v20260817-75
const CACHE = 'ventas-20260817-75';

const PRECACHE = [
  'index.html', 'su.html', 'admin.html',
  'TR.html', 'GR.html', 'HE.html', 'fact.html',
  'manifest.json', 'favicon.svg', 'icon-192.png', 'icon-512.png'
];

// Precachea los assets al instalar y activa inmediatamente.
// Se cachea cada archivo por separado (no con addAll) para que un solo
// archivo faltante o bloqueado no impida que el resto del Service Worker
// se instale y actualice correctamente.
self.addEventListener('install', e => {
  self.skipWaiting();
  e.waitUntil(
    caches.open(CACHE).then(c =>
      Promise.all(PRECACHE.map(url =>
        c.add(url).catch(err => console.warn('SW precache falló para', url, err))
      ))
    )
  );
});

// Elimina cachés viejos y toma control de todos los clientes
self.addEventListener('activate', e => {
  e.waitUntil(
    caches.keys()
      .then(keys => Promise.all(keys.filter(k => k !== CACHE).map(k => caches.delete(k))))
      .then(() => clients.claim())
  );
});

self.addEventListener('fetch', e => {
  const { request } = e;
  const url = new URL(request.url);

  // Ignorar peticiones no-GET y recursos externos (CDN, Supabase API, imágenes del bucket)
  if (request.method !== 'GET' || url.origin !== self.location.origin) return;

  const isHTML = url.pathname.endsWith('.html') || url.pathname.endsWith('/');

  if (isHTML) {
    // Network-first para HTML: siempre intenta la red para tener la versión más reciente.
    // Si falla (sin conexión), sirve desde caché.
    e.respondWith(
      fetch(request)
        .then(res => {
          const copy = res.clone();
          caches.open(CACHE).then(c => c.put(request, copy));
          return res;
        })
        .catch(() => caches.match(request))
    );
  } else {
    // Cache-first para assets estáticos (iconos, manifest)
    e.respondWith(
      caches.match(request).then(cached => cached || fetch(request).then(res => {
        const copy = res.clone();
        caches.open(CACHE).then(c => c.put(request, copy));
        return res;
      }))
    );
  }
});

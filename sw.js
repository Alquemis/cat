// Service Worker — v20261109-280
const CACHE = 'ventas-20261109-280';

const PRECACHE = [
  'index.html', 'su.html', 'admin.html',
  'TR.html', 'GR.html', 'HE.html', 'fact.html', 'rev.html',
  'manifest.json', 'favicon.svg', 'icon-192.png', 'icon-512.png'
];

// Precachea los assets al instalar y activa inmediatamente.
// Se cachea cada archivo por separado (no con addAll) para que un solo
// archivo faltante o bloqueado no impida que el resto del Service Worker
// se instale y actualice correctamente.
// cache:'reload' → se descargan directo del servidor, sin usar la caché HTTP
// del navegador (GitHub Pages la deja en max-age=600: sin esto, la versión
// nueva del SW podía precachear un HTML de hasta 10 minutos de antigüedad).
self.addEventListener('install', e => {
  self.skipWaiting();
  e.waitUntil(
    caches.open(CACHE).then(c =>
      Promise.all(PRECACHE.map(url =>
        c.add(new Request(url, { cache: 'reload' }))
          .catch(err => console.warn('SW precache falló para', url, err))
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

// Pide el HTML al servidor revalidando siempre (cache:'no-cache'): el
// navegador pregunta si el archivo cambió; si no cambió, GitHub responde
// 304 (liviano) y se usa la copia guardada; si cambió, llega la nueva.
// Se usa la URL (no el Request original) porque las navegaciones no
// permiten cambiar sus opciones de caché.
async function fetchHTMLFresh(request) {
  const res = await fetch(request.url, { cache: 'no-cache', credentials: 'same-origin' });
  // Una navegación no puede responderse con una respuesta "redirigida"
  // (p. ej. "/carpeta" → "/carpeta/"): se reconstruye como respuesta directa.
  if (res.redirected) {
    const body = await res.blob();
    return new Response(body, { status: res.status, statusText: res.statusText, headers: res.headers });
  }
  return res;
}

self.addEventListener('fetch', e => {
  const { request } = e;
  const url = new URL(request.url);

  // Ignorar peticiones no-GET y recursos externos (CDN, Supabase API, imágenes del bucket)
  if (request.method !== 'GET' || url.origin !== self.location.origin) return;

  const isHTML = request.mode === 'navigate' || url.pathname.endsWith('.html') || url.pathname.endsWith('/');

  if (isHTML) {
    // Network-first para HTML: siempre intenta la red para tener la versión más reciente.
    // Si falla (sin conexión), sirve desde caché.
    e.respondWith(
      fetchHTMLFresh(request)
        .then(res => {
          if (res.ok) {
            const copy = res.clone();
            caches.open(CACHE).then(c => c.put(request, copy));
          }
          return res;
        })
        .catch(() => caches.match(request, { ignoreSearch: true }))
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

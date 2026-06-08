// Service Worker mínimo para habilitar PWA
self.addEventListener('install', e => self.skipWaiting());
self.addEventListener('activate', e => clients.claim());

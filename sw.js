// Service Worker — v2.2
self.addEventListener('install', e => self.skipWaiting());
self.addEventListener('activate', e => clients.claim());

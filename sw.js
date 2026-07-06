// Service Worker — v2.4
self.addEventListener('install', e => self.skipWaiting());
self.addEventListener('activate', e => clients.claim());

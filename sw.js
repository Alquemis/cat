// Service Worker — v2.5
self.addEventListener('install', e => self.skipWaiting());
self.addEventListener('activate', e => clients.claim());

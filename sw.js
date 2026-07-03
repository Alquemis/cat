// Service Worker — v2.1
self.addEventListener('install', e => self.skipWaiting());
self.addEventListener('activate', e => clients.claim());

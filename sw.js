// Service Worker — v1.2
self.addEventListener('install', e => self.skipWaiting());
self.addEventListener('activate', e => clients.claim());

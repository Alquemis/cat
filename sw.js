// Service Worker — v1.1
self.addEventListener('install', e => self.skipWaiting());
self.addEventListener('activate', e => clients.claim());

// Service Worker — v1.6
self.addEventListener('install', e => self.skipWaiting());
self.addEventListener('activate', e => clients.claim());

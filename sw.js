// Service Worker — v1.7
self.addEventListener('install', e => self.skipWaiting());
self.addEventListener('activate', e => clients.claim());

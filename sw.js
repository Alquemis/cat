// Service Worker — v3.1
self.addEventListener('install', e => self.skipWaiting());
self.addEventListener('activate', e => clients.claim());

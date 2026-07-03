// Service Worker — v1.8
self.addEventListener('install', e => self.skipWaiting());
self.addEventListener('activate', e => clients.claim());

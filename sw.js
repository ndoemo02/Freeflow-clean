// Minimalny SW: bez cache, tylko rejestracja/claim
self.addEventListener('install', e => { self.skipWaiting(); });
self.addEventListener('activate', e => { e.waitUntil(self.clients.claim()); });
self.addEventListener('fetch', e => { /* nic nie cachujemy */ });

// Minimalny SW (wyłączone cache, brak white screen)
self.addEventListener('install', e => { self.skipWaiting(); });
self.addEventListener('activate', e => { e.waitUntil(self.clients.claim()); });
self.addEventListener('fetch', e => { /* przepuszczamy wszystkie requesty */ });

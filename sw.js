const version = "0.1";
const cacheName = 'thepwa-${version}';
self.addEventListener("install", e => {
    const timeStamp = Date.now();
    e.waitUntil(
        caches.open(cacheName).then(cache => {
            return cache
                .addAll([
                    'vendor/bootstrap/css/bootstrap.min.css',
                    'vendor/jquery/jquery.min.js',
                    'vendor/bootstrap/js/bootstrap.bundle.min.js',
                    'vendor/jquery-easing/jquery.easing.min.js',
                    'css/style.css',
                    'js/main.js'
                ])
                .then(() => self.skipWaiting());
        })
    );
});

self.addEventListener("activate", event => {
    event.waitUntil(self.clients.claim());
});

self.addEventListener("fetch", event => {
    event.respondWith(
        caches
            .open(cacheName)
            .then(cache => cache.match(event.request, { ignoreSearch: true }))
            .then(response => {
                return response || fetch(event.request);
            })
    );
});

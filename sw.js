const version = "0.13";
const cacheName = 'thepwa-${version}';

var update = function (request) {
    return caches.open(cacheName).then(function (cache) {
        return fetch(request).then(function (response) {
            return cache.put(request, response);
        });
    });
}

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
                    'fonts/DancingScript-Regular.ttf'
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

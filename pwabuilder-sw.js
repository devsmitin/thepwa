//This is the service worker with the Cache-first network

var CACHE = "pwabuilderPrecache";
var precacheFiles = [
    /* Add an array of files to precache for your app */
    "/",
    "/index.html",
    "/vendor/bootstrap/css/bootstrap.min.css",
    "/css/scrolling-nav.css",
    "/vendor/jquery/jquery.min.js",
    "/vendor/bootstrap/js/bootstrap.bundle.min.js",
    "/vendor/jquery-easing/jquery.easing.min.js",
    "/js/scrolling-nav.js",
    "/manifest.json"
];

//Install stage sets up the cache-array to configure pre-cache content
self.addEventListener("install", function(evt) {
    console.log("[PWA Builder] The service worker is being installed.");
    evt.waitUntil(
        precache().then(function() {
            console.log("[PWA Builder] Skip waiting on install");
            return self.skipWaiting();
        })
    );
});

//allow sw to control of current page
self.addEventListener("activate", function(event) {
    console.log("[PWA Builder] Claiming clients for current page");
    return self.clients.claim();
});

self.addEventListener("fetch", function(evt) {
    console.log(
        "[PWA Builder] The service worker is serving the asset." +
            evt.request.url
    );
    evt.respondWith(fromCache(evt.request).catch(fromServer(evt.request)));
    evt.waitUntil(update(evt.request));
    // evt.respondWith(
    //     caches.match(evt.request).then(function(response) {
    //         return response || fetch(evt.request);
    //     })
    // );
});

function precache() {
    return caches.open(CACHE).then(function(cache) {
        return cache.addAll(precacheFiles);
    });
}

function fromCache(request) {
    //we pull files from the cache first thing so we can show them fast
    return caches.open(CACHE).then(function(cache) {
        return cache.match(request).then(function(matching) {
            return matching || Promise.reject("no-match");
        });
    });
}

function update(request) {
    //this is where we call the server to get the newest version of the
    //file to use the next time we show view
    return caches.open(CACHE).then(function(cache) {
        return fetch(request).then(function(response) {
            return cache.put(request, response);
        });
    });
}

function fromServer(request) {
    //this is the fallback if it is not in the cache to go to the server and get it
    return fetch(request).then(function(response) {
        return response;
    });
}

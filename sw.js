self.addEventListener('install', event => {
    console.log("serviceworker instalado")
    self.skipWaiting();
    const cache = caches.open('seed2plate')
    .then(cache => {
        return cache.addAll([
            '/',
            'manifest.json',
            'index.html',
            'plant.html',
            'my-plants.html',
            'css/styles.css',
            'img/favicon.svg',
            'img/icon-cycle.svg',
            'img/icon-sun.svg',
            'img/icon-watering.svg',
            'img/icon-seed.svg',
            'img/logo.svg',
            'img/placeholder.svg',
            'https://cdnjs.cloudflare.com/ajax/libs/materialize/1.0.0/css/materialize.min.css',
            'https://cdnjs.cloudflare.com/ajax/libs/materialize/1.0.0/js/materialize.min.js',
            'js/scripts.js',
        ]);
    })
    event.waitUntil(cache)
});

self.addEventListener('activate', event => {
    console.log("serviceworker activado")
});

self.addEventListener('fetch', event => {
    const cacheResponse = caches.match(event.request)
    .then(response => {
        if (response){
            return response;
        } else {
            return fetch(event.request)
            .then(response => {
                return response
            })
        }
    })
    event.respondWith(cacheResponse);
})
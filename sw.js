const cachedItems = [
    '/',
    'manifest.json',
    'index.html',
    'plant.html',
    'my-plants.html',
    'css/styles.css',
    'js/scripts.js',
    'img/favicon.svg',
    'img/icon-cycle.svg',
    'img/icon-sun.svg',
    'img/icon-watering.svg',
    'img/icon-seed.svg',
    'img/logo.svg',
    'img/placeholder.svg',
    'https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@24,400,0,0',
    'https://cdnjs.cloudflare.com/ajax/libs/materialize/1.0.0/css/materialize.min.css',
    'https://cdnjs.cloudflare.com/ajax/libs/materialize/1.0.0/js/materialize.min.js',
    'https://code.jquery.com/jquery-3.7.1.slim.min.js',
    'https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@24,400,0,0',
]

self.addEventListener('install', event => {
    console.log("serviceworker installed");
    event.waitUntil(
        caches.has("seed2plate").then(isInstalled => {
            if (!isInstalled) {
                return caches.open("seed2plate").then(cache => {
                    cache.addAll(cachedItems);
                })
            }
        })
    );
});

self.addEventListener('activate', event => {
    console.log("serviceworker active")
});

self.addEventListener('fetch', event => {
    if (event.request.method !== 'GET') { // no se procesan requests POST con métodos del cache
        return;
    }
    event.respondWith(
        caches.open('seed2plate').then(cache => {
            return cache.match(event.request).then(response => {
                if (response) {
                    return response;
                }
                return fetch(event.request).then(networkResponse => {
                    cache.put(event.request, networkResponse.clone());
                    return networkResponse;
                });
            });
        })
    );
});
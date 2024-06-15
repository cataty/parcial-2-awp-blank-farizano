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
            if(!isInstalled) {
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

self.addEventListener('fetch', (event) => {
    console.log("cache dinamica")
    const query = event.request;
    const cachedResponse = caches.match(query).then(async (response) => {
        if(response) return response; // si está en el cache, traer del cache
        const newResponse = await fetch(query.url);
        const cache = await caches.open("seed2plate");
        await cache.put(query, newResponse.clone());
        return newResponse;
    })
    event.respondWith(cachedResponse);
})
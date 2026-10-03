const STATIC_CACHE = "pocket-store-static-v1";
const DATA_CACHE = "pocket-store-data-v1";

const API_URL = "https://jsonplaceholder.typicode.com/users";


const APP_SHELL = [
    "./",
    "./index.html",
    "./styles.css",
    "./app.js",
    "./manifest.json",
    "./icons/icon-192.png",
    "./icons/icon-512.png"
];


self.addEventListener("install", event => {

    console.log("Service Worker: Instalando...");

    event.waitUntil(

        caches.open(STATIC_CACHE)
            .then(cache => {

                console.log(
                    "Service Worker: Guardando App Shell"
                );

                return cache.addAll(APP_SHELL);

            })

    );

    self.skipWaiting();

});



self.addEventListener("activate", event => {

    console.log("Service Worker: Activado");

    const validCaches = [
        STATIC_CACHE,
        DATA_CACHE
    ];

    event.waitUntil(

        caches.keys()
            .then(cacheNames => {

                return Promise.all(

                    cacheNames.map(cacheName => {

                        if (!validCaches.includes(cacheName)) {

                            console.log(
                                "Eliminando caché antigua:",
                                cacheName
                            );

                            return caches.delete(cacheName);

                        }

                    })

                );

            })

    );

    self.clients.claim();

});



self.addEventListener("fetch", event => {

    const request = event.request;

    const url = new URL(request.url);


    if (request.url === API_URL) {

        event.respondWith(

            fetch(request)

                .then(response => {

                    const clonedResponse =
                        response.clone();

                    caches.open(DATA_CACHE)
                        .then(cache => {

                            cache.put(
                                request,
                                clonedResponse
                            );

                        });

                    return response;

                })

                .catch(() => {

                    console.log(
                        "Sin internet: utilizando API desde caché"
                    );

                    return caches.match(request);

                })

        );

        return;

    }




    event.respondWith(

        caches.match(request)
            .then(cachedResponse => {

                if (cachedResponse) {

                    return cachedResponse;

                }

                return fetch(request);

            })

    );

});
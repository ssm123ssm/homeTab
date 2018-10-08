/*
var CACHE_NAME = 'my-site-cache-v1';
var urlsToCache = [
    './res/styles/main.css',
    './res/scripts/main.js',
    './res/styles/bootstrap.css',
    './res/styles/animate.css',
    './res/styles/font-awesome-4.7.0/css/font-awesome.css',
    './res/scripts/angular.js',
    './res/scripts/jquery.js',
    './res/scripts/tether.min.js',
    './res/scripts/bootstrap.js',
    './res/scripts/cookies.js',
    './index.html',
    './res/blobs/1.jpg',
    './res/blobs/2.jpg',
    './res/blobs/3.jpg',
    './res/blobs/4.jpg',
    './res/blobs/5.jpg',
    './res/blobs/6.jpg',
    './res/blobs/7.jpg',
    './res/blobs/8.jpg',
    './res/blobs/9.jpg',
    './res/blobs/10.jpg',
    './res/blobs/11.jpg',
    './res/blobs/12.jpg',
    './res/blobs/13.jpg',
    './res/blobs/14.jpg',
    './res/blobs/15.jpg',
    './res/blobs/16.jpg',
    './res/blobs/17.jpg',
    './res/blobs/18.jpg',
    './res/blobs/19.jpg',
    './res/blobs/20.jpg',
    './res/blobs/21.jpg',
    './res/blobs/22.jpg',
    './res/blobs/23.jpg',
    './res/blobs/24.jpg'
];

self.addEventListener('install', function (event) {
    // Perform install steps
    event.waitUntil(
        caches.open(CACHE_NAME)
        .then(function (cache) {
            console.log('Opened cache');
            return cache.addAll(urlsToCache);
        })
    );
});


self.addEventListener('fetch', function (event) {
    event.respondWith(
        caches.match(event.request)
        .then(function (response) {
            // Cache hit - return response

            if (response) {
                console.log('Cache hit!');
                return response;
            }
            return fetch(event.request);

        })
    );
});*/
var CACHE_NAME = 'image-cache';
var urlsToCache = [
    './res/blobs/1.jpg',
    './res/blobs/2.jpg',
    './res/blobs/3.jpg',
    './res/blobs/4.jpg'
];

self.addEventListener('install', function (event) {
    // Perform install steps
    event.waitUntil(
        caches.open(CACHE_NAME)
        .then(function (cache) {
            console.log('Opened cache');
            return cache.addAll(urlsToCache);
        })
    );
});


//WorkBox
importScripts('https://storage.googleapis.com/workbox-cdn/releases/3.6.1/workbox-sw.js');
if (workbox) {
    console.log(`Yay! Workbox is loaded 🎉`);
} else {
    console.log(`Boo! Workbox didn't load 😬`);
}



workbox.routing.registerRoute(
    // Cache CSS files
    /.*\.html/,
    // Use cache but update in the background ASAP
    workbox.strategies.staleWhileRevalidate({
        // Use a custom cache name
        cacheName: 'html-cache',
    })
);

workbox.routing.registerRoute(
    // Cache CSS files
    /.*\.css/,
    // Use cache but update in the background ASAP
    workbox.strategies.staleWhileRevalidate({
        // Use a custom cache name
        cacheName: 'css-cache',
    })
);

workbox.routing.registerRoute(
    // Cache CSS files
    /.*\.js/,
    // Use cache but update in the background ASAP
    workbox.strategies.staleWhileRevalidate({
        // Use a custom cache name
        cacheName: 'js-cache',
    })
);

workbox.routing.registerRoute(
    // Cache image files
    /.*\.(?:png|jpg|jpeg|svg|gif)/,
    // Use the cache if it's available
    workbox.strategies.cacheFirst({
        // Use a custom cache name
        cacheName: 'image-cache',
        plugins: [
      new workbox.expiration.Plugin({
                // Cache only 20 images
                maxEntries: 20,
                // Cache for a maximum of a 3 month
                maxAgeSeconds: 7 * 24 * 60 * 60 * 12,
            })
    ],
    })
);

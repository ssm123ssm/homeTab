var CACHE_NAME = 'my-site-cache-v1';
var urlsToCache = [
    './res/styles/main.css',
    './res/scripts/main.js',
    './res/styles/bootstrap.css',
    './res/styles/animate.css',
    './res/styles/font-awesome-4.7.0/css/font-awesome.css',
    /*'./res/scripts/angular-animate.js',*/
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
});

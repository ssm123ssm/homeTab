var CACHE_NAME = 'my-site-cache-v1';
var urlsToCache = [
    './res/styles/main.css',
    './res/scripts/main.js',
    './res/styles/bootstrap.css',
    './res/styles/animate.css',
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
    './res/blobs/8.jpg'

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
            /*console.log('Cahche hit fail. Caching now');
// IMPORTANT: Clone the request. A request is a stream and
// can only be consumed once. Since we are consuming this
// once by cache and once by the browser for fetch, we need
// to clone the response.
var fetchRequest = event.request.clone();

return fetch(fetchRequest).then(
    function (response) {
        // Check if we received a valid response
        if (!response || response.status !== 200 || response.type !== 'basic') {
            return response;
        }

        // IMPORTANT: Clone the response. A response is a stream
        // and because we want the browser to consume the response
        // as well as the cache consuming the response, we need
        // to clone it so we have two streams.
        var responseToCache = response.clone();

        caches.open(CACHE_NAME)
            .then(function (cache) {
                cache.put(event.request, responseToCache);
            });

        return response;
    }
);*/
        })
    );
});

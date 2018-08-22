const VERSION = 1.0;
const IMAGES = 8;
var user = "User";
var currentImage = Math.floor(Math.random() * IMAGES) + 1;
//ANGULAR
var app = angular.module('myApp', []);
app.controller('ctrl', ['$scope', function ($scope) {
    $scope.user = user;
    $scope.am = true;
    $scope.greeting = "Greetings,";
    //getting location details
    getLocation($scope);

    setInterval(function () {
        $scope.time = Date.now();
        console.log(new Date().getHours());
        var hour = new Date().getHours();
        if (new Date().getHours() >= 12) {
            $scope.am = false;
        } else {
            $scope.am = true;
        }
        if ($scope.am == false && hour >= 17) {
            $scope.greeting = "Good evening,"
        }
        if ($scope.am == false && hour < 17) {
            $scope.greeting = "Good afternoon,"
        }
        if ($scope.am == true) {
            $scope.greeting = "Good morning,"
        }
        $scope.$apply();
    }, 1000);
    }]);


//location
var apiKey = 'OVQblkRsr1NnzAYRY6L5ixR0GGzlN3GO';

function getState(key, scope) {
    var url = 'http://dataservice.accuweather.com/currentconditions/v1/' + key + '?apikey=' + apiKey;
    //console.log(url);
    $.ajax({
        url: url,
        method: 'GET',
        success: function (data) {
            console.log(data);
            console.log(data[0].WeatherText);
            scope.weather = `It's ${data[0].WeatherText} today`;
            scope.$apply();
        }
    });
}

function getLocation(scope) {
    navigator.geolocation.getCurrentPosition(function (position) {
        console.log(position);
        //getting locationKey
        var keyUrl = 'http://dataservice.accuweather.com/locations/v1/cities/geoposition/search?apikey=' + apiKey + '&q=' + position.coords.latitude + ',' + position.coords.longitude;
        $.ajax({
            url: keyUrl,
            method: 'GET',
            success: function (data) {
                console.log(data.LocalizedName);
                scope.city = data.LocalizedName;
                var locaTionKey = data.Key;
                getState(locaTionKey, scope);
            }
        });
    });
}

function getCookie() {

    if (Cookies.get('homeTab')) {
        var cookie = Cookies.getJSON('homeTab');
        angular.element(document.getElementById('parent')).scope().user = cookie.name;
        angular.element(document.getElementById('parent')).scope().$apply();
        currentImage = cookie.imageKey;
        console.log(`Current imageKey: ${currentImage}`);
        setCookie();
    } else {
        setCookie();
    }
}

function setCookie() {
    if (Cookies.get('homeTab')) {
        var next = Math.floor(Math.random() * IMAGES) + 1;
        Cookies.set('homeTab', {
            name: angular.element(document.getElementById('parent')).scope().user,
            imageKey: next
        }, {
            expires: 365
        });
    } else {
        Cookies.set('homeTab', {
            name: angular.element(document.getElementById('parent')).scope().user,
            imageKey: Math.floor(Math.random() * IMAGES) + 1
        }, {
            expires: 365
        });
    }
}

$(window).on('load', function () {
    getCookie();
    makeEditable($(".user_name_self"));
    setBackground();
    setVersion();
    descendCurtain();
});

//curtain
function descendCurtain() {
    var curtain = $(".filter2");
    curtain.addClass('filter-loaded');
    setTimeout(function () {
        curtain.css('z-index', -12);
    }, 1000);
}

//setting version
function setVersion() {
    $(".version").html(`v${VERSION.toFixed(1)}`);
}

//background image
function setBackground() {
    console.log(currentImage);
    $("body").css('background-image', `url('./res/blobs/${currentImage}.jpg')`);
}

//make editable
function makeEditable(elem) {
    var init = elem.html();

    elem.addClass('editable');
    elem.dblclick(function () {
        console.log('edit mode');
        window.getSelection().removeAllRanges();
        elem.attr('contenteditable', 'true');
        elem.addClass('editing');
        elem.focus();
    });
    elem.keypress(function (e) {

        if (e.which == 13) {
            elem.attr('contenteditable', 'false');

            if (elem.html() == '') {
                elem.html(init);
            }
            elem.removeClass('editing');
            angular.element(document.getElementById('parent')).scope().user = elem.html();
            setCookie();
            getCookie();
        }

    });
    elem.blur(function () {
        if (elem.html() == '') {
            elem.html(init);
        }
        console.log('exiting editer mode');
        elem.attr('contenteditable', 'false');
        elem.removeClass('editing');
        angular.element(document.getElementById('parent')).scope().user = elem.html();
        setCookie();
        getCookie();
    });
}

//serviceWorker
if ('serviceWorker' in navigator) {
    window.addEventListener('load', function () {
        navigator.serviceWorker.register('../../sw.js').then(function (registration) {
            // Registration was successful
            console.log('ServiceWorker registration successful with scope: ', registration.scope);

        }, function (err) {
            // registration failed :(
            console.log('ServiceWorker registration failed: ', err);
        });
    });
}

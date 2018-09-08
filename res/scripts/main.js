const VERSION = 1.1;
const VERSION_HISTORY = {
    1.0: 'Basic HomeTab Dashboard',
    1.1: 'Adding TODO functionality'
}
const IMAGES = 8;
var user = "User";
var currentImage = Math.floor(Math.random() * IMAGES) + 1;

//ANGULAR
var app = angular.module('myApp', []);
app.controller('ctrl', ['$scope', function ($scope) {
    $scope.user = user;
    $scope.am = true;
    $scope.greeting = "Greetings,";
    $scope.todos = [];
    $scope.todoDelete = function (event) {
        collapseAllTodoOptionPopups();
        if (confirm('Are you sure to delete this todo item?')) {
            $scope.todos.splice(angular.element(event.target).scope().$index, 1);
            saveTodos();
            if ($scope.todos.length == 0) {
                $(".add-todo-input").blur();
            }
            collapseAllTodoOptionPopups();
        }

    };
    $scope.todoOptions = function (event) {
        var isOpen = angular.element(event.target).scope().showPopup;
        collapseAllTodoOptionPopups();
        if (!isOpen) {
            openTodoOptions(event);
        }
    }
    $scope.mark = function (todo) {
        todo.checked ? uncheck(todo) : check(todo);
        collapseAllTodoOptionPopups();
    }
    $scope.triggerEdit = function (event) {
        var node = $(event.target).parent().siblings(".td")[0];
        collapseAllTodoOptionPopups();
        $(node).dblclick();
    }

    //getting location details
    getLocation($scope);

    //Time updating
    setInterval(function () {
        $scope.time = Date.now();
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
            scope.weather = `It's ${data[0].WeatherText} today`;
            scope.$apply();
        }
    });
}

function getLocation(scope) {
    navigator.geolocation.getCurrentPosition(function (position) {
        var keyUrl = 'http://dataservice.accuweather.com/locations/v1/cities/geoposition/search?apikey=' + apiKey + '&q=' + position.coords.latitude + ',' + position.coords.longitude;
        $.ajax({
            url: keyUrl,
            method: 'GET',
            success: function (data) {
                scope.city = data.LocalizedName;
                var locaTionKey = data.Key;
                getState(locaTionKey, scope);
            }
        });
    });
}

//todo checking the box
function check(todo) {
    todo.checked = true;
    todo.status = 'completed';
    saveTodos();
}

//todo unchecking
function uncheck(todo) {
    todo.checked = false;
    todo.status = 'pending';
    saveTodos();
}

//Toggle todo options popup
function openTodoOptions(event) {
    angular.element(event.target).scope().showPopup = 1;
}

//collapsing all popup menus
function collapseAllTodoOptionPopups() {
    $(".options").each(function (elem) {
        angular.element($(".options")[elem]).scope().showPopup = 0;
    });

}

//GETTING USERNAME AND CURRENT IMAGE KEYS, AND UPDATING COOKIE FOR NEXT TIME
function getCookie() {
    if (Cookies.get('homeTab')) {
        var cookie = Cookies.getJSON('homeTab');
        angular.element(document.getElementById('parent')).scope().user = cookie.name;
        angular.element(document.getElementById('parent')).scope().$apply();
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

//SECTION TOGGLER. ELEM TO TOGGLE, IN AND OUT ANIMATIONS, IF STATE IS SAVED IN PANNELS_COOKIE THAT IS THE LAST PARA. THAT PARA IS PASSED INTO setCustomCookie
function toggle(elem, inn, out, pannel) {
    if (elem.css('display') == 'none') {
        elem.removeClass(out);
        elem.addClass(inn);
        elem.css('display', 'block');
        if (pannel) {
            savePannelStatus(pannel, true);
        }
    } else {
        if (elem.hasClass(inn)) {
            elem.removeClass(inn);
            elem.addClass(out);
            if (pannel) {
                savePannelStatus(pannel, false);
            }
            setTimeout(function () {
                elem.css('display', 'none');
            }, 1000);
        } else {
            elem.removeClass(out);
            elem.addClass(inn);
            if (pannel) {
                savePannelStatus(pannel, true);
            }
        }
    }

}

//SAVING A PANNEL'S VISIBILITY STATUS TO PANNEL_COOKIE
function savePannelStatus(pannel, visibility) {
    var obj = {};
    if (Cookies.get('pannels')) {
        obj = Cookies.getJSON('pannels');
    }
    var tem = {
        isVisible: visibility
    }
    obj[pannel] = tem;
    setCustomCookie('pannels', obj);
}

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
    $("body").css('background-image', `url('./res/blobs/${currentImage}.jpg')`);
}

//make editable
function makeEditable(elem, ctx) {
    var init = elem.html();

    elem.addClass('editable');
    elem.dblclick(function (e) {
        console.log($(e.target));
        init = $(e.target).html();
        window.getSelection().removeAllRanges();
        $(e.target).attr('contenteditable', 'true');
        $(e.target).addClass('editing');
        $(e.target).focus();
    });
    if (ctx == 'name') {
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
    if (ctx == 'todo') {
        elem.keypress(function (e) {

            if (e.which == 13) {
                $(e.target).attr('contenteditable', 'false');

                if ($(e.target).html() == '') {
                    $(e.target).html(init);
                }
                $(e.target).removeClass('editing');
                angular.element(e.target).scope().todo.todo = $(e.target).html();
                angular.element(e.target).scope().$apply();
                saveTodos();
            }

            $(e.target).blur(function () {
                $(e.target).attr('contenteditable', 'false');

                if ($(e.target).html() == '') {
                    $(e.target).html(init);
                }
                $(e.target).removeClass('editing');
                angular.element(e.target).scope().todo.todo = $(e.target).html();
                angular.element(e.target).scope().$apply();
                saveTodos();
            });

        });
    }
}

//GETTING TODOS VIA THE TODO COOKIE. IF NOT EXISTING, CREATES AN EMPTY TODO COOKIE
function getTodos() {
    if (Cookies.get('todos')) {
        angular.element(document.getElementById('parent')).scope().todos = Cookies.getJSON('todos').todos;
        angular.element(document.getElementById('parent')).scope().$apply();
    } else {
        Cookies.set('todos', {
            todos: []
        }, {
            expires: 365
        });
    }
}

//SAVING ANGULAR SCOPE'S TODOS INTO COOKIE
function saveTodos() {
    Cookies.set('todos', {
        todos: angular.element(document.getElementById('parent')).scope().todos
    }, {
        expires: 365
    });
}

//MODIFYING TODO STATUS WITH CHECKBOX AND THEN SAVING CHANGES INTO COOKIE
function todoCheck() {
    $(".todo-check").change(function (e) {
        var scope = angular.element($(e.target).parent()).scope();
        if (e.target.checked) {
            scope.todo.status = 'completed';
            scope.todo.checked = true;
        } else {
            scope.todo.status = 'pending';
            scope.todo.checked = false;
        }
        scope.$apply();
        saveTodos();
    });
}

//GETTING PANNEL STATUS VIA PANNELS COOKIE AND SETTING THEIR VISIBILITY ACCORDINGLY
function setPannels() {
    if (Cookies.get('pannels')) {
        var pannels = Cookies.getJSON('pannels');
        if (pannels.todo.isVisible) {
            makeVisible('todo');
        }
    } else {
        var obj = {
            todo: {
                isVisible: false
            }
        }
        setCustomCookie('pannels', obj);
    }
}

//MAKING A PANNEL VISIBLE. SINCE ALL PANNELS ARE INITIATED TO A INVISIBLE STATE, TOGGLING VISIBILITY WILL MAKE IT VISIBLE ON PAGE LOAD
function makeVisible(section) {
    if (section == 'todo') {
        toggle($(".todo-frame"), 'fadeIn', 'fadeOut', 'todo');
        if (angular.element(document.getElementById('parent')).scope().todos.length > 0) {
            $(".todo-frame-t").addClass('d-none');
            $(".add-todo").removeClass("d-none");
            $(".add-todo-input").focus();
        }
    }
}

//SETTING A COOKIE WITH DEFAULTS, BY PASSING A CUSTOM OBJECT
function setCustomCookie(name, obj) {
    Cookies.set(name, obj, {
        expires: 365
    });
}

//serviceWorker
if ('serviceWorker' in navigator) {
    window.addEventListener('load', function () {
        navigator.serviceWorker.register('./sw.js').then(function (registration) {
            // Registration was successful
            console.log('ServiceWorker registration successful with scope: ', registration.scope);

        }, function (err) {
            // registration failed :(
            console.log('ServiceWorker registration failed: ', err);
        });
    });
}

$(window).on('load', function () {
    getCookie();
    getTodos();
    makeEditable($(".user_name_self"), 'name');
    makeEditable($(".td"), 'todo');
    setBackground();
    setVersion();
    todoCheck();
    setPannels();

    //ALL ARE SET. NOW DESCENDING THE CURTAIN !!!
    descendCurtain();

    //EVENT LISTENERS

    //TODO
    $(".link-todo").click(function () {
        toggle($(".todo-frame"), 'fadeIn', 'fadeOut', 'todo');
        if (angular.element(document.getElementById('parent')).scope().todos.length > 0) {
            $(".todo-frame-t").addClass('d-none');
            $(".add-todo").removeClass("d-none");
            $(".add-todo-input").focus();
        }
    });
    $("#add-todo-btn").click(function () {
        $(".todo-frame-t").addClass("d-none");
        $(".add-todo").removeClass("d-none");
        $(".add-todo-input").focus();
    });
    $(".add-todo-input").blur(function () {
        if ($(".add-todo-input").val() == '' && angular.element(document.getElementById('parent')).scope().todos.length == 0) {
            $(".todo-frame-t").removeClass("d-none");
            $(".add-todo").addClass("d-none");
        }
    });
    $(".add-todo-input").keypress(function (e) {
        if (e.which == 13) {
            if ($(".add-todo-input").val() != '') {
                var todo = $(".add-todo-input").val();
                $(".add-todo-input").val('');
                var index = angular.element(document.getElementById('parent')).scope().todos.length + 1;
                angular.element(document.getElementById('parent')).scope().todos.push({
                    todo: todo,
                    status: 'pending',
                    checked: false
                });
                angular.element(document.getElementById('parent')).scope().$apply();
                makeEditable($(".todo-item"), 'todo');
                Cookies.set('todos', {
                    todos: angular.element(document.getElementById('parent')).scope().todos
                }, {
                    expires: 365
                });
                todoCheck();
            }
        }
    });

});

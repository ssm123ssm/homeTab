const VERSION = 2.1;
const VERSION_HISTORY = {
    1.0: 'Basic HomeTab Dashboard',
    1.1: 'Adding TODO functionality',
    1.2: 'Adding Focus on functionality',
    1.3: 'Adding Timer functionality',
    2.1: 'With new images BETA'
}
const IMAGES = 24;
const CACHED_IMAGES = 4;
const CONGRADS = ['Way to go', 'Good job', 'Nice work', 'Awesome', 'It\'s done'];
var user = "User";
var currentImage = Math.floor(Math.random() * IMAGES) + 1;
var currentImageCached = Math.floor(Math.random() * CACHED_IMAGES) + 1;
var timerInterval;
var congradsTimeoutRunning = false;

//intervals
var intervals = [];
//ANGULAR
var app = angular.module('myApp', []);
app.controller('ctrl', ['$scope', function ($scope) {
    $scope.user = user;
    $scope.am = true;
    $scope.greeting = "Greetings,";
    $scope.todos = [];
    $scope.focus = undefined;
    $scope.focus_done = false;
    $scope.todoDelete = function (event) {
        collapseAllTodoOptionPopups();
        if (confirm('Are you sure to delete this todo item?')) {
            $scope.todos.splice(angular.element(event.target).scope().$index, 1);
            saveTodos();
            if ($scope.todos.length == 0) {
                $(".add-todo-input").blur();
            }
            collapseAllTodoOptionPopups();

            var todo = angular.element(event.target).scope().todo;
            if (todo.focused) {
                $scope.focus = undefined;
                $scope.focus_done = false;
                saveFocus();
            }

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
    $scope.timerSet = false;
    $scope.timeSetter = {
        days: 0,
        hours: 0,
        mins: 0,
        increaseDays: function () {
            $scope.timeSetter.days += 1;
        },
        decreaseDays: function () {
            $scope.timeSetter.days != 0 ? $scope.timeSetter.days -= 1 : $scope.timeSetter.days;

        },
        increaseHours: function () {
            if ($scope.timeSetter.hours != 23) {
                $scope.timeSetter.hours += 1;
            } else {
                $scope.timeSetter.hours = 0;
                $scope.timeSetter.increaseDays();
            }
        },
        decreaseHours: function () {
            if ($scope.timeSetter.hours != 0) {
                $scope.timeSetter.hours -= 1;
            } else {
                if ($scope.timeSetter.days != 0) {
                    $scope.timeSetter.hours = 23;
                    $scope.timeSetter.decreaseDays();
                }
            }
        },
        increaseMins: function () {
            if ($scope.timeSetter.mins != 59) {
                $scope.timeSetter.mins += 1;
            } else {
                $scope.timeSetter.mins = 0;
                $scope.timeSetter.increaseHours();
            }
        },
        decreaseMins: function () {
            if ($scope.timeSetter.mins != 0) {
                $scope.timeSetter.mins -= 1;
            } else {
                if ($scope.timeSetter.days != 0 || $scope.timeSetter.hours != 0) {
                    $scope.timeSetter.mins = 59;
                    $scope.timeSetter.decreaseHours();
                }
            }
        }



    };
    $scope.timer = {
        timeout: false,
        target: 0,
        ongoing: false,
        days: 0,
        hours: 0,
        mins: 0,
        increaseDays: function () {
            $scope.timer.days += 1;
        },
        decreaseDays: function () {
            $scope.timer.days != 0 ? $scope.timer.days -= 1 : $scope.timer.days;

        },
        increaseHours: function () {
            if ($scope.timer.hours != 23) {
                $scope.timer.hours += 1;
            } else {
                $scope.timer.hours = 0;
                $scope.timer.increaseDays();
            }
        },
        decreaseHours: function () {
            if ($scope.timer.hours != 0) {
                $scope.timer.hours -= 1;
            } else {
                if ($scope.timer.days != 0) {
                    $scope.timer.hours = 23;
                    $scope.timer.decreaseDays();
                }
            }
        },
        increaseMins: function () {
            if ($scope.timer.mins != 59) {
                $scope.timer.mins += 1;
            } else {
                $scope.timer.mins = 0;
                $scope.timer.increaseHours();
            }
        },
        decreaseMins: function () {
            if ($scope.timer.mins != 0) {
                $scope.timer.mins -= 1;
            } else {
                if ($scope.timer.days != 0 || $scope.timer.hours != 0) {
                    $scope.timer.mins = 59;
                    $scope.timer.decreaseHours();
                }
            }
        }
    };
    $scope.startTimer = function () {
        $scope.timer.days = $scope.timeSetter.days;
        $scope.timer.hours = $scope.timeSetter.hours;
        $scope.timer.mins = $scope.timeSetter.mins;
        $scope.timer.timeout = false;
        var nw = Date.now();
        var target = nw + ($scope.timer.mins * 60 * 1000) + ($scope.timer.hours * 60 * 60 * 1000) + ($scope.timer.days * 24 * 60 * 60 * 1000);

        $scope.timerSet = true;
        $scope.timer.ongoing = true;
        $scope.timer.target = target;
        saveTargetTime();
        //target time calculation


        if (timerInterval) {
            clearFromIntervals(timerInterval);
            console.log('Timer interval ' + timerInterval + ' clearerd');
            clearInterval(timerInterval);
        }
        timerInterval = setInterval(function () {
            $scope.timer.decreaseMins();
            if ($scope.timer.mins == 0 && $scope.timer.hours == 0 && $scope.timer.days == 0) {
                $scope.timer.timeout = true;
                clearInterval(timerInterval);
            }
        }, 60000);
        intervals.push(timerInterval);
        console.log('Interval set from startTimer', intervals);
        toggle($(".time-setter-frame"), 'fadeIn', 'fadeOut');
        toggle($(".todo-frame"), 'fadeIn', 'fadeOut');
    }

    //Handles both focusing and unfocusing
    $scope.focusOnTodo = function (todo) {
        if (todo.focused) {
            todo.focused = false;
            $scope.focus = undefined;
            $scope.timerSet = false;
            $scope.timer.ongoing = false;
            clearInterval(timerInterval);
            console.log('timerInterval ' + timerInterval + ' cleared');
        } else {
            //unfocussing all
            $scope.todos.forEach(function (item) {
                if (item.focused) {
                    item.focused = false;
                    $scope.focus = undefined;
                    $scope.timerSet = false;
                    $scope.timer.ongoing = false;
                }
            });
            if (timerInterval) {
                clearInterval(timerInterval);
                console.log('timerInterval ' + timerInterval + ' cleared');
            }
            todo.focused = true;
            $scope.timerSet = false;
            $scope.timer.ongoing = false;
            $scope.focus_done = todo.checked;
            $scope.focus = todo.todo;
        }
        saveTodos();
        saveFocus();
        collapseAllTodoOptionPopups();
        if (Cookies.get('target')) {
            setCustomCookie('target', {});
        }
    }

    //timer setting for focused task
    $scope.setTimer = function (todo) {
        if (todo.focused && !todo.checked) {
            toggle($(".time-setter-frame"), 'fadeIn', 'fadeOut');
            collapseAllTodoOptionPopups();
            toggle($('.todo-frame'), 'fadeIn', 'fadeOut');
        }

    }

    $scope.closeTimeSetter = function () {
        toggle($('.time-setter-frame'), 'fadeIn', 'fadeOut');
        toggle($('.todo-frame'), 'fadeIn', 'fadeOut');

    }

    //getting location details
    getLocation($scope);

    //Time updating
    intervals.push(setInterval(function () {
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
    }, 1000));
    console.log('interval set from Time', intervals);
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

//saving focus
function saveFocus() {
    setCustomCookie('focus', {
        todo: angular.element($('#parent')).scope().focus
    });
}

//check focus
function getFocus() {
    if (Cookies.get('focus')) {
        angular.element($('#parent')).scope().focus = Cookies.getJSON('focus').todo;
        angular.element($('#parent')).scope().todos.forEach(function (item) {

            if (item.focused && item.checked) {
                angular.element($('#parent')).scope().focus_done = true;
            }
        });
    }

}

//todo checking the box
function check(todo) {
    if (todo.focused) {
        //debugger;
        angular.element($("#parent")).scope().focus_done = true;
        angular.element($("#parent")).scope().timer.ongoing = false;
        saveTargetTime();
    }
    todo.checked = true;
    todo.status = 'completed';

    if (!congradsTimeoutRunning) {
        $('.done-todo').html(CONGRADS[Math.floor(Math.random() * (CONGRADS.length - 1))] + '!!!');

        congradsTimeoutRunning = true;
        setTimeout(function () {
            congradsTimeoutRunning = false;
        }, 2100);

        toggle($('.done-todo'), 'zoomIn', 'zoomOut');
        setTimeout(function () {
            toggle($('.done-todo'), 'zoomIn', 'zoomOut');
        }, 1000);
    }


    saveTodos();
}

//todo unchecking
function uncheck(todo) {
    if (todo.focused) {
        angular.element($("#parent")).scope().focus_done = false;
    }
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
        if (angular.element($(".options")[elem]).scope().showPopup) {
            angular.element($(".options")[elem]).scope().showPopup = 0;
            //angular.element($(".options")[elem]).scope().$apply();
        }
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

//saving taregt time for todo countdown
function saveTargetTime() {
    setCustomCookie('target', {
        val: angular.element($('#parent')).scope().timer.target,
        ongoing: angular.element($('#parent')).scope().timer.ongoing
    });
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



    if (!Cookies.get('imageCache')) {
        setCustomCookie('imageCache', {
            images: [1, 2, 3, 4]
        });
    }
    var imageCacheLength = Cookies.getJSON('imageCache').images.length;
    //Connectivity checking
    $.ajax({
        url: '/connect',
        method: 'POST',
        data: {
            version: VERSION
        },
        success: function (data) {
            console.log('Connection established');
            $("body").css('background-image', `url('./res/blobs/${currentImage}.jpg')`);
            var newCache = Cookies.getJSON('imageCache').images;
            if (newCache.indexOf(currentImage) < 0) {
                newCache.push(currentImage);
            }
            setCustomCookie('imageCache', {
                images: newCache
            });
            console.log(Cookies.getJSON('imageCache'));
        },
        error: function (data) {
            console.log('No connectivity');
            $("body").css('background-image', `url('./res/blobs/${Cookies.getJSON('imageCache').images[Math.floor(Math.random() * imageCacheLength) + 1]}.jpg')`);
        }
    });

}

//make editable
function makeEditable(elem, ctx) {
    var init = elem.html();

    elem.addClass('editable');
    elem.dblclick(function (e) {
        collapseAllTodoOptionPopups();
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

                //setting focus
                var todo = angular.element(e.target).scope().todo;
                if (todo.focused) {
                    angular.element($("#parent")).scope().focus = todo.todo;
                    saveFocus();
                }

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

                //setting focus
                var todo = angular.element(e.target).scope().todo;
                if (todo.focused) {
                    angular.element($("#parent")).scope().focus = todo.todo;
                    saveFocus();
                }
            });

        });
    }
}

//getting timer details
function getTimer() {

    if (Cookies.get('target')) {
        //debugger;
        var nw = Date.now();
        var diff_s = Math.round((Cookies.getJSON('target').val - nw) / 1000);
        var ongoing = Cookies.getJSON('target').ongoing;
        var scope = angular.element($("#parent")).scope();

        if (ongoing) {
            angular.element($("#parent")).scope().timer.ongoing = true;
        }

        if (ongoing && diff_s > 0) {

            var days = Math.floor(diff_s / (24 * 3600));
            diff_s -= days * 86400;
            var hours = Math.floor((diff_s / (3600)) % 24);
            diff_s -= hours * 3600;
            var mins = Math.floor((diff_s / 60) % 60);
            diff_s -= mins * 60;
            var secs = diff_s % 60;
            if (secs >= 30) {
                mins += 1;
            }
            scope.timer.days = days;
            scope.timer.hours = hours;
            scope.timer.mins = mins;
            scope.$apply();

            if (scope.timer.mins == 0 && scope.timer.hours == 0 && scope.timer.days == 0) {
                scope.timer.timeout = true;
            }

            //timerLoop here
            if (timerInterval) {
                clearInterval(timerInterval);
                clearFromIntervals(timerInterval);
                console.log('Timer interval ' + timerInterval + ' clearerd');
            }
            timerInterval = setInterval(function () {
                angular.element($("#parent")).scope().timer.decreaseMins();
                if (scope.timer.mins == 0 && scope.timer.hours == 0 && scope.timer.days == 0) {
                    clearInterval(timerInterval);
                    scope.timer.timeout = true;
                }
            }, 60000);
            intervals.push(timerInterval);
            console.log('interval set from getTimer', intervals);

        }
        if (ongoing && diff_s < 0) {
            scope.timer.timeout = true;
        }
    }
}

function clearFromIntervals(val) {
    var index = intervals.indexOf(val);
    if (val >= 0) {
        intervals.splice(index, 1);
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
        //console.log(angular.element(e.target).scope());
        if (e.target.checked) {
            scope.todo.status = 'completed';
            scope.todo.checked = true;
            //debugger;
            if (!congradsTimeoutRunning) {
                $('.done-todo').html(CONGRADS[Math.floor(Math.random() * (CONGRADS.length - 1))] + '!!!');

                congradsTimeoutRunning = true;
                setTimeout(function () {
                    congradsTimeoutRunning = false;
                }, 2100);

                toggle($('.done-todo'), 'zoomIn', 'zoomOut');
                setTimeout(function () {
                    toggle($('.done-todo'), 'zoomIn', 'zoomOut');
                }, 1000);
            }

            if (angular.element(e.target).scope().todo.focused) {
                angular.element($("#parent")).scope().focus_done = true;
                angular.element($("#parent")).scope().timer.ongoing = false;
                saveTargetTime();
            }

        } else {
            scope.todo.status = 'pending';
            scope.todo.checked = false;
            if (angular.element(e.target).scope().todo.focused) {
                angular.element($("#parent")).scope().focus_done = false;
            }
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
    getFocus();
    getTimer();

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
                    checked: false,
                    focused: false
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

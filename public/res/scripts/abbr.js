function v() {
    for (var i = 0; i < arguments.length; i++) {
        console.log(arguments[i]);
    }
}

function randUpTo(val) {
    return Math.floor(Math.random() * val);
}

function max(ar) {
    if (ar.length > 0) {
        var max = ar[0];
        ar.forEach(function (val) {
            if (val > max) {
                max = val;
            }
        });
        return max;
    }
    return 0;
}

function maxIndex(ar) {
    if (ar.length > 1) {
        var index = 0;
        var max = ar[0];

        for (var i = 0; i < ar.length; i++) {
            if (ar[i] > max) {
                max = ar[i];
                index = i;
            }
        }
        return index;
    }
    v('INVALID ARRAY FOR MAX_INDEX FUNCTION');
    return 0;
}

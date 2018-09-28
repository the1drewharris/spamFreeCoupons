(function() {
var symbolTag = '[object Symbol]';
var reIsDeepProp = /\.|\[(?:[^[\]]*|(["'])(?:(?!\1)[^\\]|\\.)*?\1)\]/,
    reIsPlainProp = /^\w*$/,
    rePropName = /[^.[\]]+|\[(?:(-?\d+(?:\.\d+)?)|(["'])((?:(?!\2)[^\\]|\\.)*?)\2)\]|(?=(\.|\[\])(?:\4|$))/g;

_.extend(_, {get: get});
_.extend(_, {isKey: isKey});

function isKey(value, object) {
    if (_.isArray(value)) {
        return false;
    }
    var type = typeof value;
    if (type == 'number' || type == 'symbol' || type == 'boolean' ||
        value == null || isSymbol(value)) {
        return true;
    }
    return reIsPlainProp.test(value) || !reIsDeepProp.test(value) ||
        (object != null && value in Object(object));
}

function isSymbol(value) {
    return typeof value == 'symbol' ||
        (isObjectLike(value) && value.toString() == symbolTag);
}

function isObjectLike(value) {
    return !!value && typeof value == 'object';
}

function get(object, path, defaultValue) {
    var result = object == null ? undefined : baseGet(object, path);
    return result === undefined ? defaultValue : result;
}

function baseGet(object, path) {
    path = isKey(path, object) ? [path] : castPath(path);

    var index = 0,
        length = path.length;

    while (object != null && index < length) {
        object = object[toKey(path[index++])];
    }
    return (index && index == length) ? object : undefined;
}

function toKey(value) {
    if (typeof value == 'string' || isSymbol(value)) {
        return value;
    }
    var result = (value + '');
    return (result == '0' && (1 / value) == -INFINITY) ? '-0' : result;
}

function castPath(value) {
    return _.isArray(value) ? value : _.memoize(value);
}
})();
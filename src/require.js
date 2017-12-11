export {requireFrom} from 'd3-require';
import {requireFrom} from 'd3-require';

var isAbsolute = new RegExp('^([a-z]+://|//)'),
    isRelative = new RegExp('^[.]{0,2}/'),
    libs = new Map;


export function isAbsoluteUrl (url) {
    return isAbsolute.test(url);
}


export function resolve (name, options) {
    var dist = libs.get(name),
        main = name,
        path = null,
        base = location;

    if (options) {
        if (typeof options.base === 'string') base = options.base;
        path = removeFrontSlash(options.path);
    }

    if (dist) {
        path = path || dist.main;
        main = removeBackSlash(dist.origin || main);
        if (dist.version)
            main = `${name}@${dist.version}`;
        if (path)
            main = `${main}/${path}`;
    } else if (path) {
        if (isAbsolute.test(main))
            main = new URL(main, base).origin;
        else if (isRelative.test(main))
            main = '';
        main = `${main}/${path}`;
    }

    if (isAbsolute.test(main)) {
        return main;
    } else if (isRelative.test(main)) {
        return new URL(main, base).href;
    } else {
        if (!main.length || /^[\s._]/.test(main) || /\s$/.test(main)) throw new Error("illegal name");
        return "https://unpkg.com/" + main;
    }
}

export var require = requireFrom(resolve);

require.libs = libs;


function removeFrontSlash (path) {
    if (typeof path === 'string' && path.substring(0, 1) === '/') path = path.substring(1);
    return path;
}


function removeBackSlash (path) {
    if (typeof path === 'string' && path.substring(path.length-1) === '/') path = path.substring(0, path.substring);
    return path;
}

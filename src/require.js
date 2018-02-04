import {requireFrom} from 'd3-require';


var isAbsolute = new RegExp('^([a-z]+://|//)'),
    isRelative = new RegExp('^[.]{0,2}/'),
    libs = new Map,
    nodeModules = new Map,
    inNode = Boolean(typeof module !== 'undefined' && module.exports);


export const viewRequire = requireWithLibs();


export function isAbsoluteUrl (url) {
    return isAbsolute.test(url);
}

export function viewResolve (name, options) {
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


function requireWithLibs () {
    let r = inNode ? nodeRequire : requireFrom(viewResolve);
    r.libs = libs;
    return r;
}


function removeFrontSlash (path) {
    if (typeof path === 'string' && path.substring(0, 1) === '/') path = path.substring(1);
    return path;
}


function removeBackSlash (path) {
    if (typeof path === 'string' && path.substring(path.length-1) === '/') path = path.substring(0, path.substring);
    return path;
}


/* istanbul ignore next */
function nodeRequire () {
    let module;
    var all = [];
    for (let i=0; i<arguments.length; ++i) {
        module = nodeModules.get[arguments[i]];
        if (!module) {
            module = require(arguments[i]);
            nodeModules.set(arguments[i], module);
        }
        all.push(module);
    }
    return Promise.resolve(all.length > 1 ? merge(all) : all[0]);
}


/* istanbul ignore next */
function merge(modules) {
    var o = {}, i = -1, n = modules.length, m, k;
    while (++i < n) {
        for (k in (m = modules[i])) {
            if (hasOwnProperty.call(m, k)) {
                if (m[k] == null) Object.defineProperty(o, k, {get: getter(m, k)});
                else o[k] = m[k];
            }
        }
    }
    return o;
}

/* istanbul ignore next */
function getter(object, name) {
    return () => object[name];
}

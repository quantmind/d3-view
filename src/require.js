const isAbsolute = new RegExp("^([a-z]+://|//)"),
  isRelative = new RegExp("^[.]{0,2}/"),
  hasOwnProperty = Array.prototype.hasOwnProperty;

export const viewLibs = new Map();
export const isAbsoluteUrl = url => isAbsolute.test(url);

export const viewResolve = (name, options) => {
  var dist = viewLibs.get(name),
    main = name,
    path = null,
    base = typeof location !== "undefined" ? location : "";

  if (options) {
    if (typeof options.base === "string") base = options.base;
    path = removeFrontSlash(options.path);
  }

  if (dist) {
    path = path || dist.main;
    main = removeBackSlash(dist.origin || main);
    if (dist.version) main = `${name}@${dist.version}`;
    if (path) main = `${main}/${path}`;
  } else if (path) {
    if (isAbsolute.test(main)) main = new URL(main, base).origin;
    else if (isRelative.test(main)) main = "";
    main = `${main}/${path}`;
  }

  if (isAbsolute.test(main)) {
    return main;
  } else if (isRelative.test(main)) {
    return new URL(main, base).href;
  } else {
    if (!main.length || /^[\s._]/.test(main) || /\s$/.test(main))
      throw new Error("illegal name");
    return "https://unpkg.com/" + main;
  }
};

export const viewRequireFrom = (resolver, root) => {
  const modules = new Map(),
    queue = [],
    map = queue.map,
    some = queue.some,
    getRoot = () => {
      return !root && typeof window !== "undefined" ? window : root;
    },
    requireRelative = base => {
      return name => {
        var url = resolver(name + "", base),
          module = modules.get(url);
        if (!module)
          modules.set(
            url,
            (module = new Promise((resolve, reject) => {
              root = getRoot();
              const script = root.document.createElement("script");
              script.onload = function() {
                try {
                  resolve(queue.pop()(requireRelative(url)));
                } catch (error) {
                  reject(new Error("invalid module"));
                }
                script.remove();
              };
              script.onerror = function() {
                reject(new Error("unable to load module"));
                script.remove();
              };
              script.async = true;
              script.src = url;
              root.define = define;
              root.document.head.appendChild(script);
            }))
          );
        return module;
      };
    },
    requireOne = requireRelative(null);

  function require(name) {
    return arguments.length > 1
      ? Promise.all(map.call(arguments, requireOne)).then(merge)
      : requireOne(name);
  }

  require.root = getRoot;

  define.amd = {};

  return require;

  function define(name, dependencies, factory) {
    if (arguments.length < 3) (factory = dependencies), (dependencies = name);
    if (arguments.length < 2) (factory = dependencies), (dependencies = []);
    queue.push(
      some.call(dependencies, isexports)
        ? function(require) {
            var exports = {};
            return Promise.all(
              map.call(dependencies, function(name) {
                return isexports((name += "")) ? exports : require(name);
              })
            ).then(function(dependencies) {
              factory.apply(null, dependencies);
              return exports;
            });
          }
        : function(require) {
            return Promise.all(map.call(dependencies, require)).then(function(
              dependencies
            ) {
              return typeof factory === "function"
                ? factory.apply(null, dependencies)
                : factory;
            });
          }
    );
  }
};

export const viewRequire = viewRequireFrom(viewResolve);

// INTERNALS

const isexports = name => name + "" === "exports";

const removeFrontSlash = path => {
  if (typeof path === "string" && path.substring(0, 1) === "/")
    path = path.substring(1);
  return path;
};

const removeBackSlash = path => {
  if (typeof path === "string" && path.substring(path.length - 1) === "/")
    path = path.substring(0, path.substring);
  return path;
};

const merge = modules => {
  var o = {},
    i = -1,
    n = modules.length,
    m,
    k;
  while (++i < n) {
    for (k in (m = modules[i])) {
      if (hasOwnProperty.call(m, k)) {
        if (m[k] == null) Object.defineProperty(o, k, { get: getter(m, k) });
        else o[k] = m[k];
      }
    }
  }
  return o;
};

const getter = (object, name) => {
  return () => object[name];
};

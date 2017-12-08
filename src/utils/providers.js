import {logger, inBrowser, isFunction} from 'd3-let';
import {defaultDebug} from './debug';


logger.debug = null;


export default {
    // log messages
    logger: logger,
    // fetch remote resources
    fetch: fetch(),
    // callbacks when page is loaded in browser
    readyCallbacks: [],
    // Set/unset debug
    setDebug (active) {
        if (!arguments.length || active)
            this.logger.debug = isFunction(active) ? active : defaultDebug;
        else
            this.logger.debug = null;
    },
    require: d3Require()
};


function fetch() {
    if (inBrowser) return window.fetch;
}


function d3Require () {
    var require = null;
    if (inBrowser) {
        if (window.d3) require = window.d3.require;
    }
    return require || unsupportedRequire;
}


function unsupportedRequire () {
    return Promise.reject(new Error('Cannot requires libraries, d3-require is not available'));
}

unsupportedRequire.resolve = function  (name) {
    return name;
};

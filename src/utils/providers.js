import {logger, inBrowser, isFunction} from 'd3-let';
import {viewResolve, viewRequire} from '../require';
import {defaultDebug} from './debug';


logger.debug = null;


export default {
    //
    // Additional d3 modules, usually imported via d3.require
    d3: globalD3(),
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
    }
};


function fetch() {
    if (inBrowser) return window.fetch;
}


function globalD3 () {
    var gd3 = {};
    if (inBrowser) {
        gd3 = window.d3 || gd3;
        window.d3 = gd3;
    }
    if (!gd3.require) {
        gd3.require = viewRequire;
        gd3.resolve = viewResolve;
    }
    return gd3;
}

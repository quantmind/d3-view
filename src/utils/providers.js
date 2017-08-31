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
    }
};


function fetch() {
    if (inBrowser) return window.fetch;
}

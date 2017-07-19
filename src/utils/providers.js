import {logger, inBrowser, isFunction} from 'd3-let';

import {defaultDebug} from './debug';


logger.debug = null;


export default {
    logger: logger,
    fetch: fetch(),
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

import {logger, inBrowser, isFunction} from 'd3-let';

var debug = logger.info;

logger.debug = null;


export default {
    logger: logger,
    fetch: fetch(),
    readyCallbacks: [],
    // Set/unset debug
    setDebug (active) {
        if (!arguments.length || active)
            this.logger.debug = isFunction(active) ? active : debug;
        else
            this.logger.debug = null;
    }
};


function fetch() {
    if (inBrowser) return window.fetch;
}

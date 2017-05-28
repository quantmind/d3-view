import {logger, inBrowser} from 'd3-let';

export default {
    logger: logger,
    fetch: fetch(),
    readyCallbacks: []
};


function fetch() {
    if (inBrowser) return window.fetch;
}

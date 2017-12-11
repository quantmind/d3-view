import {logger, inBrowser, isFunction, assign} from 'd3-let';
import {viewResolve, viewRequire} from '../require';
import {defaultDebug} from './debug';


logger.debug = null;


export default assign({
    //
    require: viewRequire,
    //
    resolve: viewResolve,
    //
    // log messages
    logger: logger,
    //
    // callbacks when page is loaded in browser
    readyCallbacks: [],
    // Set/unset debug
    setDebug (active) {
        if (!arguments.length || active)
            this.logger.debug = isFunction(active) ? active : defaultDebug;
        else
            this.logger.debug = null;
    }
}, function () {
    if (inBrowser) {
        return assign({
            fetch: window.fetch,
        }, window.d3);
    }
}());

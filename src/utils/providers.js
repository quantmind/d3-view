import { assign, inBrowser, isFunction, logger } from "d3-let";
import { viewRequire, viewResolve } from "../require";

logger.debug = null;

export default assign(
  {
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
    setDebug(active) {
      if (!arguments.length || active)
        this.logger.debug = isFunction(active) ? active : defaultDebug;
      else this.logger.debug = null;
    }
  },
  (function() {
    if (inBrowser) {
      return assign(
        {
          fetch: window.fetch,
          location: window.location
        },
        window.d3
      );
    }
  })()
);

function defaultDebug(msg) {
  this.info(msg);
}

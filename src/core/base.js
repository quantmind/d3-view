import { event, select, selectAll } from "d3-selection";
import "d3-transition";
import { viewRequireFrom, viewResolve } from "../require";
import { jsonResponse, textResponse } from "../utils/http";
import providers from "../utils/providers";
import asSelect from "../utils/select";
import { htmlElement, template } from "../utils/template";

//
//  Base d3-view Object
//  =====================
//
export default {
  // available once mounted
  // this is the browser window.document unless we are mounting on jsdom
  ownerDocument: null,
  //
  // d3-view object
  isd3: true,
  //
  providers: providers,
  //
  // Create a view element from a template and optional context
  viewElement(source, context, ownerDocument) {
    return htmlElement(source, context, ownerDocument || this.ownerDocument);
  },
  //
  select(selector) {
    if (typeof selector === "string")
      return select(this.ownerDocument || document).select(selector);
    return select(selector);
  },
  //
  selectAll(selector) {
    if (typeof selector === "string")
      return select(this.ownerDocument || document).selectAll(selector);
    return selectAll(selector);
  },
  //
  // Shortcut for fetch function in providers
  fetch(url, options) {
    var fetch = providers.fetch;
    return arguments.length == 1 ? fetch(url) : fetch(url, options);
  },
  //
  fetchText(url, ...x) {
    return this.fetch(url, ...x).then(textResponse);
  },
  //
  json(url, ...x) {
    return this.fetch(url, ...x).then(jsonResponse);
  },
  //
  // render a template from a url
  renderFromUrl(url, context, asElement = true) {
    var cache = this.cache;
    if (cache.has(url))
      return Promise.resolve(render(cache.get(url), context, asElement));
    return this.fetchText(url).then(response => {
      cache.set(url, response.data);
      return render(response.data, context, asElement);
    });
  },
  //
  // render from a distribution name. Use d3-require resolve method to find the url
  renderFromDist(dist, path, context, asElement = true) {
    var resolve = providers.resolve;
    return this.renderFromUrl(
      resolve(dist, { path: path }),
      context,
      asElement
    );
  },
  //
  on(el, name, callback) {
    el = asSelect(el);
    if (callback === null) return el.on(name, null);
    else el.on(name, () => callback(event));
  },
  //
  selectChildren(el) {
    if (!arguments.length) el = this.el;
    return this.selectAll(Array.prototype.slice.call(el.children));
  },
  //
  domEvent() {
    return event;
  },
  //
  logError(err) {
    if (err.stack) providers.logger.error(err);
    else providers.logger.error(`[${this.name}] ${err}`);
    return this;
  },
  //
  logWarn(msg) {
    providers.logger.warn(`[${this.name}] ${msg}`);
    return this;
  },
  //
  logInfo(msg) {
    providers.logger.info(`[${this.name}] ${msg}`);
    return this;
  },
  //
  logDebug(msg) {
    if (providers.logger.debug) providers.logger.debug(`[${this.name}] ${msg}`);
    return this;
  },

  require() {
    const root = this.ownerDocument.defaultView;
    if (!root.d3) root.d3 = {};
    let require = root.d3.require;
    if (!require) {
      if (this.providers.require.root() === root)
        require = this.providers.require;
      else require = viewRequireFrom(viewResolve, root);
      root.d3.require = require;
    }
    return require.apply(undefined, arguments);
  }
};

const render = (text, context, asElement) =>
  asElement ? htmlElement(text, context) : template(text, context);

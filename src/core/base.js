import {select, selectAll, event} from 'd3-selection';

import providers from '../utils/providers';
import {htmlElement, template} from '../utils/template';
import {jsonResponse, textResponse} from '../utils/http';
import asSelect from '../utils/select';
import {formatError, formatWarn} from './errors';
//
//  Base d3-view Object
//  =====================
//
export default {
    // d3-view object
    isd3: true,
    //
    providers: providers,
    //
    // Create a view element, same as createElement but compile it
    viewElement: htmlElement,
    //
    select (el) {
        return select(el);
    },
    //
    selectAll (el) {
        return selectAll(el);
    },
    //
    createElement (tag) {
        return select(document.createElement(tag));
    },
    // Shortcut for fetch function in providers
    fetch (url, options) {
        var fetch = providers.fetch;
        return arguments.length == 1 ? fetch(url) : fetch(url, options);
    },
    //
    fetchText (url, ...x) {
        return this.fetch(url, ...x).then(textResponse);
    },
    //
    json (url, ...x) {
        return this.fetch(url, ...x).then(jsonResponse);
    },
    //
    // render a template from a url
    renderFromUrl (url, context, asElement=true) {
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
    renderFromDist(dist, path, context, asElement=true) {
        var resolve = providers.resolve;
        return this.renderFromUrl(resolve(dist, {path: path}), context, asElement);
    },
    //
    on (el, name, callback) {
        el = asSelect(el);
        if (callback === null) return el.on(name, null);
        else el.on(name, () => callback(event));
    },
    //
    selectChildren (el) {
        if (!arguments.length) el = this.el;
        return this.selectAll(Array.prototype.slice.call(el.children));
    },
    //
    domEvent () {
        return event;
    },
    //
    logError (err) {
        if (err.stack) providers.logger.error(err);
        else providers.logger.error(`[${this.name}] ${formatError(err)}`);
        return this;
    },
    //
    logWarn (msg) {
        providers.logger.warn(`[${this.name}] ${formatWarn(msg)}`);
        return this;
    },
    //
    logInfo (msg) {
        providers.logger.info(`[${this.name}] ${msg}`);
        return this;
    },
    //
    logDebug (msg) {
        if (providers.logger.debug)
            providers.logger.debug(`[${this.name}] ${msg}`);
        return this;
    }
};


function render (text, context, asElement) {
    return asElement ? htmlElement(text, context) : template(text, context);
}

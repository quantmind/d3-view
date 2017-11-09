import {select, selectAll, event} from 'd3-selection';

import providers from '../utils/providers';
import {htmlElement, html} from '../utils/html';
import {HttpError} from '../utils/errors';
import resolvedPromise from '../utils/promise';
import asSelect from '../utils/select';
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
        return this.fetch(url, ...x).then(response => response.text());
    },
    //
    json (url, ...x) {
        return this.fetch(url, ...x).then(jsonResponse);
    },
    //
    // render a template from a url
    renderFromUrl (url, context, asElement=true) {
        var cache = this.cache;
        if (url in cache)
            return resolvedPromise(render(cache[url], context, asElement));
        return this.fetchText(url).then(template => {
            cache[url] = template;
            return render(template, context, asElement);
        });
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
    }
};


export function jsonResponse (response) {
    if (response.status >= 300) throw new HttpError(response);
    var ct = (response.headers.get('content-type') || '').split(';')[0];
    if (ct === 'application/json')
        return response.json();
    else
        throw new Error(`Expected JSON content type, got ${ct}`);
}


function render (template, context, asElement) {
    return asElement ? htmlElement(template, context) : html(template, context);
}

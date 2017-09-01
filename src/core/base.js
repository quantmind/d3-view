import {select} from 'd3-selection';

import providers from '../utils/providers';
import {htmlElement} from '../utils/html';

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
    createElement (tag) {
        return select(document.createElement(tag));
    },
    // Shortcut for fetch function in providers
    fetch (url, options) {
        var fetch = providers.fetch;
        return arguments.length == 1 ? fetch(url) : fetch(url, options);
    },
    // render a template from a url
    renderFromUrl (url, context) {
        var cache = this.cache;
        if (url in cache)
            return new Promise((resolve) => resolve(htmlElement(cache[url])));
        return this.fetch(url).then(response => response.text()).then(template => {
            cache[url] = template;
            return htmlElement(template, context);
        });
    }
};

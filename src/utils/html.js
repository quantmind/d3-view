import {isString} from 'd3-let';
import {select} from 'd3-selection';

import warn from './warn';
import providers from './providers';


// require handlebar
export function compile (text) {
    var compile = providers.compileHtml;
    if (compile) return compile(text);
    warn('No compileHtml function available in viewProviders, cannot render template');
}


export function html (source, context) {
    if (isString(source)) {
        if (context) {
            var s = compile(source);
            if (!s) return source;
            source = s;
        }
        else
            return source;
    }
    return source(context);
}


export function htmlElement (source, context) {
    var el = select(document.createElement('div'));
    el.html(html(source, context));
    var children = el.node().children;
    if (children.length !== 1) warn(`HtmlElement function should return one root element only, got ${children.length}`);
    return children[0];
}

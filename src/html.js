import {inBrowser, isString} from 'd3-let';
import {warn} from './utils';
import {select} from 'd3-selection';


export function compile (text) {
    // require handlebar
    var handlebars = inBrowser ? window.handlebars : require('handlebars');
    if (handlebars) return handlebars.compile(text);
    warn('compile function requires handlebars');
}


export function html (source, context) {
    if (isString(source)) source = compile(source);
    if (!source) return '';
    return source(context);
}


export function htmlElement (source, context) {
    var el = select(document.createElement('div'));
    el.html(html(source, context));
    var children = el.node().children;
    if (children.length !== 1) warn(`HtmlElement function should return one root element only, got ${children.length}`);
    return children[0];
}

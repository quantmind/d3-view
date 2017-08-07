import {select} from 'd3-selection';

//
//  viewMount
//  =============
//
//  Mount an existing dom element el with compiled html
//
//  * data: optional object for the first component
//  * onMount : optional onMount callback
//
//  Return a Promise
export default function (el, html, data, onMount) {
    var p = select(el).html(html).mount(data, onMount);
    if (!p) p = new Promise(function (resolve) {resolve();});
    return p;
}

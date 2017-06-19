import {select} from 'd3-selection';


export default function (el, html, data) {
    var p = select(el).html(html).mount(data);
    if (!p) p = new Promise(function (resolve) {resolve();});
    return p;
}

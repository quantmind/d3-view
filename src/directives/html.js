import {isString} from 'd3-let';
//
//  d3-html
//  =============
//  attach html or text to the innerHtml property
//
//  Usage:
//      <div id="foo" d3-html="output"></div>
export default {

    refresh: function (model, html) {
        if (isString(html)) this.sel.html(html);
    }
};

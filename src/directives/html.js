import {isString} from 'd3-let';
//
//  d3-html
//  =============
//  attach html or text to the innerHtml property
//
//  Usage:
//      <div id="foo" d3-html="output"></div>
//
//  new d3.View({el: '#foo', model: {output: '<h1>A title</h1>'}});
export default {

    refresh: function (model, html) {
        if (isString(html)) this.sel.html(html);
    }
};

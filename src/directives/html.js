import {select} from 'd3-selection';
import {isString, isNumber} from 'd3-let';

import slice from '../utils/slice';


//
//  d3-html
//  =============
//  attach html or text to the innerHtml property and mount components if required
//
//  Usage:
//      <div id="foo" d3-html="output"></div>
export default {

    refresh: function (model, html) {
        if (isNumber(html)) html = ''+html;
        if (isString(html)) {
            this.sel.html(html);
            var children = slice(this.el.children);
            for (let i=0; i<children.length; ++i)
                select(children[i]).mount();
        }
    }
};

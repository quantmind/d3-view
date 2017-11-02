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

    refresh (model, html) {
        if (isNumber(html)) html = ''+html;
        if (isString(html)) {
            this.transition(this.sel.style('opacity', 0).html(html))
                .style('opacity', 1);
            var children = slice(this.el.children);
            for (let i=0; i<children.length; ++i)
                this.select(children[i]).mount();
        }
    }
};

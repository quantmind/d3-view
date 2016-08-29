import {select} from 'd3-selection';
import Directive from '../directive';


//
// Bind html
//
//  Usage:
//      <div id="foo" d3-html="output"></div>
//
//  new d3.View({el: '#foo', model: {output: '<h1>A title</h1>'}});
export default class extends Directive {

    mount (attrName) {
        var el = select(this.el),
            model = this.model;
        this.attrName = attrName;

        // model => DOM binding
        model.$on(attrName, function (value) {
            el.html(value);
        });
    }
}

import {select} from 'd3-selection';
import {isString} from 'd3-let';
import Directive from '../directive';


//
// Bind html
//
//  Usage:
//      <div id="foo" d3-html="output"></div>
//
//  new d3.View({el: '#foo', model: {output: '<h1>A title</h1>'}});
export default class extends Directive {

    mount () {
        var dir = this;
        //model => DOM binding
        this.model.$on(this.expression, function () {
            dir.mount();
        });

        var value = this.model.$get(this.expression);
        if (isString(value)) {
            var el = select(this.el);
            el.html(value);
        }
    }
}

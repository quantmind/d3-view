import {select} from 'd3-selection';
import Directive from '../directive';
import expression from '../parser';

//
// Bind an expression to an event
//
//  Usage:
//      <div id="foo" d3-html="output"></div>
//
//  new d3.View({el: '#foo', model: {output: '<h1>A title</h1>'}});
export default class extends Directive {

    mount () {
        var event = this.extra || 'click',
            expr = expression(self.expression),
            model = this.model;
        if (!expr) return;

        select(this.el).on(`${event}.${this.uid}`, () => {
            expr.eval(model);
        });
    }
}

import {select} from 'd3-selection';
import Directive from '../directive';


//
// Bind an expression to an event
//
//  Usage:
//      <div id="foo" d3-html="output"></div>
//
//  new d3.View({el: '#foo', model: {output: '<h1>A title</h1>'}});
export default class extends Directive {

    mount () {
        var event = `${this.event}.${this.uid}`;
        select(this.el).on(event);
    }
}

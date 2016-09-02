import {select} from 'd3-selection';
import {isString} from 'd3-let';
import Directive from '../directive';
import {expression} from '../parser';

//
//  d3-on directive
//  ===================
//
//  Bind an expression to an event
//
//  Usage:
//      <div id="foo" d3-on:click="doSomething()"></div>
//
export default class extends Directive {

    mount () {
        var event = this.extra || 'click',
            expr = this.expression,
            model = this.model;

        select(this.el).on(`${event}.${this.uid}`, () => {
            if (isString(expr)) expr = expression(expr);
            if (expr) expr.eval(model);
        });
    }
}

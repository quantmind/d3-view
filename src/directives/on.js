import Directive from '../directive';

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

    mount (model) {
        var event = this.arg || 'click',
            expr = this.expression;

        // DOM event => model binding
        this.sel.on(`${event}.${this.uid}`, ($event) => {
            model.$event = $event;
            expr.eval(model);
            delete model.$event;
        });
    }

    destroy () {
        var event = this.arg || 'click';
        this.sel.on(`${event}.${this.uid}`, null);
    }
}

import {select} from 'd3-selection';
import uid from './uid';
import {warn} from './utils';
import {viewExpression} from './parser';

//
// Directive base class
//
// Directives are special attributes with the d3- prefix.
// Directive attribute values are expected to be binding expressions.
// A directive’s job is to reactively apply special behavior to the DOM
// when the value of its expression changes.
//
// A directive can implement one or more of the directive methods:
//
//  * create
//  * mount
//  * refresh
//  * destroy
//
export default class {

    constructor (el, attr, arg) {
        this.el = el;
        this.name = attr.name;
        this.arg = arg;
        var expr = uid(this).create(attr.value);
        if (expr) this.expression = viewExpression(expr);
    }

    // hooks
    create (expression) {
        return expression;
    }

    mount (model) {
        return model;
    }

    refresh () {}

    destroy () {}

    get sel () {
        return select(this.el);
    }

    get priority () {
        return 1;
    }

    warn (msg) {
        warn(msg);
    }

    removeAttribute () {
        this.el.removeAttribute(this.name);
    }

    // Execute directive
    execute (model) {
        // No binding expression - nothing to do
        if (!this.expression) return;
        this.removeAttribute();

        model = this.mount(model);
        // No model returned - abort execution
        if (!model) return;

        var dir = this,
            sel = this.sel,
            refresh = function () {
                try {
                    dir.refresh(model, dir.expression.eval(model));
                } catch (msg) {
                    warn(`Error while refreshing "${dir.name}" directive: ${msg}`);
                }
            };

        // Bind expression identifiers with model
        this.identifiers = this.expression.identifiers().map((id) => {
            var event = `${id}.${dir.uid}`;
            model.$on(event, refresh);
            return id;
        });

        sel.on(`remove.${dir.uid}`, () => {
            this.identifiers.forEach((id) => {
                model.$off(`${id}.${dir.uid}`);
            });
            dir.destroy(model);
        });

        refresh();
    }
}

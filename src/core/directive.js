import {assign} from 'd3-let';

import viewExpression from '../parser/expression';
import warn from '../utils/warn';
import uid from '../utils/uid';
import sel from '../utils/sel';

//
// Directive Prototype
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
const prototype = {
    priority: 1,

    // hooks
    create: function (expression) {
        return expression;
    },

    mount: function (model) {
        return model;
    },

    refresh: function () {

    },

    destroy: function () {

    },

    removeAttribute: function () {
        this.el.removeAttribute(this.name);
    },

    // Execute directive
    execute: function (model) {
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
};

// Directive constructor
export default function (obj) {

    function Directive (el, attr, arg) {
        this.el = el;
        this.name = attr.name;
        this.arg = arg;
        var expr = sel(uid(this)).create(attr.value);
        if (expr) this.expression = viewExpression(expr);
    }

    Directive.prototype = assign({}, prototype, obj);

    function directive (el, attr, arg) {
        return new Directive(el, attr, arg);
    }

    directive.prototype = Directive.prototype;
    return directive;
}

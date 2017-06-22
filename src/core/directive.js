import assign from 'object-assign';
import {isFunction} from 'd3-let';
import {map} from 'd3-collection';

import viewExpression from '../parser/expression';
import viewModel from '../model/main';
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
    create (expression) {
        return expression;
    },

    // pre mount
    preMount () {

    },

    mount (model) {
        return model;
    },

    refresh () {

    },

    destroy () {

    },

    removeAttribute () {
        this.el.removeAttribute(this.name);
    },

    // Execute directive
    execute (model) {
        if (!this.active) return;
        this.removeAttribute();

        model = this.mount(model);
        // No model returned - abort execution
        if (!model) return;

        var dir = this,
            sel = this.sel,
            refresh = function () {
                try {
                    let value = dir.expression ? dir.expression.eval(model) : undefined;
                    dir.refresh(model, value);
                } catch (msg) {
                    warn(`Error while refreshing "${dir.name}" directive: ${msg}`);
                }
            };

        // Bind expression identifiers with model
        let bits, target, attr, i;
        dir.identifiers = [];
        if (!this.expression) {
            dir.identifiers.push({
                model: model,
                attr: ''
            });
        } else {
            var modelEvents = map();
            this.expression.identifiers().forEach(identifier => {
                bits = identifier.split('.');
                target = model;
                attr = null;

                for (i=0; i<bits.length-1; ++i) {
                    target = target[bits[i]];
                    if (!(target instanceof viewModel)) {
                        attr = bits.slice(0, i+1).join('.');
                        warn(`Property ${attr} is not a reactive model. Directive ${dir.name} cannot bind to ${identifier}`);
                        break;
                    }
                }

                if (attr === null) {
                    attr = bits[bits.length-1];
                    if (isFunction(target[attr])) {
                        modelEvents.set(target.uid, target);
                        attr = '';
                    } else
                        dir.identifiers.push({
                            model: target,
                            attr: attr
                        });
                }
            });
            let identifiers = [];
            modelEvents.each((target) => {
                dir.identifiers.forEach(identifier => {
                    if (identifier.model.uid !== target.uid)
                        identifiers.push(identifier);
                });
                identifiers.push({
                    model: target,
                    attr: ''
                });
                dir.identifiers = identifiers;
            });
        }

        this.identifiers.forEach(identifier => {
            var event = `${identifier.attr}.${dir.uid}`;
            identifier.model.$on(event, refresh);
        });

        sel.on(`remove.${dir.uid}`, () => {
            this.identifiers.forEach(identifier => {
                identifier.model.$off(`${identifier.attr}.${dir.uid}`);
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
        this.active = !attr.value || this.expression;
    }

    Directive.prototype = assign({}, prototype, obj);

    function directive (el, attr, arg) {
        return new Directive(el, attr, arg);
    }

    directive.prototype = Directive.prototype;
    return directive;
}

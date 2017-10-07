import assign from 'object-assign';
import {isFunction, isObject} from 'd3-let';
import {map, set} from 'd3-collection';

import viewExpression from '../parser/expression';
import viewModel from '../model/main';
import warn from '../utils/warn';
import uid from '../utils/uid';
import sel from '../utils/sel';
import base from './base';

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
const prototype = assign({}, base, {
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
            destroy = this.destroy,
            sel = this.sel,
            refresh = function () {
                let value = dir.expression ? dir.expression.eval(model) : undefined;
                dir.refresh(model, value);
            };

        // bind destroy to the model
        dir.destroy = () => destroy.call(dir, model);
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
                    if (!isObject(target)) {
                        attr = bits.slice(0, i+1).join('.');
                        warn(`Property ${attr} is not an object. Directive ${dir.name} cannot bind to ${identifier}`);
                        break;
                    }
                }

                // process attribute
                if (attr === null) {
                    if (!(target instanceof viewModel))
                        return warn(`${identifier} is not a reactive model. Directive ${dir.name} cannot bind to it`);
                    addTarget(modelEvents, target, bits[bits.length-1]);
                }
            });

            modelEvents.each(target => {
                if (target.events.has(''))
                    dir.identifiers.push({
                        model: target.model,
                        attr: ''
                    });
                else
                    target.events.each(attr => {
                        dir.identifiers.push({
                            model: target.model,
                            attr: attr
                        });
                    });
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
});

// Directive constructor
export default function (obj) {

    function Directive (el, attr, arg) {
        this.el = el;
        this.name = attr.name;
        this.arg = arg;
        var expr = sel(uid(this)).create(attr.value);
        if (expr) this.expression = viewExpression(expr);
        if (!this.active)
            this.active = !attr.value || this.expression;
    }

    Directive.prototype = assign({}, prototype, obj);

    function directive (el, attr, arg) {
        return new Directive(el, attr, arg);
    }

    directive.prototype = Directive.prototype;
    return directive;
}


function addTarget (modelEvents, model, attr) {
    var target = modelEvents.get(model.uid),
        value = arguments.length === 3 ? model[attr] : undefined;

    if (!target) {
        target = {
            model: model,
            events: set()
        };
        modelEvents.set(model.uid, target);
    }
    //
    // a method of the model, event is at model level
    if (isFunction(value) || arguments.length === 2)
        target.events.add('');
    // value is another model, events at both target model level and value model level
    else if (value instanceof viewModel) {
        target.events.add('');
        addTarget(modelEvents, value);
    } else {
        // make sure attr is a reactive property of model
        if (!model.$events.has(attr))
            model.$set(attr, null);
        target.events.add(attr);
    }
}

import assign from 'object-assign';
import {select} from 'd3-selection';
import {isFunction, isObject} from 'd3-let';
import {map, set} from 'd3-collection';

import viewExpression from '../parser/expression';
import viewModel from '../model/main';
import warn from '../utils/warn';
import uid from '../utils/uid';
import sel from '../utils/sel';
import providers from '../utils/providers';
import {htmlElement} from '../utils/html';


export const base = {
    isd3: true,
    //
    providers: providers,
    // #TODO: remove this
    htmlElement: htmlElement,
    // same as export
    viewElement: htmlElement,
    //
    createElement (tag) {
        return select(document.createElement(tag));
    },
    // Shortcut for fetch function in providers
    fetch (url, options) {
        var fetch = providers.fetch;
        return arguments.length == 1 ? fetch(url) : fetch(url, options);
    },
    // render a template from a url
    renderFromUrl (url, context) {
        var cache = this.cache;
        if (url in cache)
            return new Promise((resolve) => resolve(htmlElement(cache[url])));
        return this.fetch(url).then(response => response.text()).then(template => {
            cache[url] = template;
            return htmlElement(template, context);
        });
    }
};

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
            sel = this.sel,
            refresh = function () {
                let value = dir.expression ? dir.expression.eval(model) : undefined;
                dir.refresh(model, value);
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
    if (isFunction(value) || arguments.length === 2)
        target.events.add('');
    else if (value instanceof viewModel) {
        target.events.add('');
        addTarget(modelEvents, value);
    } else
        target.events.add(attr);
}

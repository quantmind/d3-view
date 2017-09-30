import assign from 'object-assign';
import {isFunction, isArray, isPromise, isString, pop} from 'd3-let';
import {map} from 'd3-collection';
import {dispatch} from 'd3-dispatch';

import base from './base';
import createDirective from './directive';
import warn from '../utils/warn';
import asSelect from '../utils/select';
import maybeJson from '../utils/maybeJson';
import slice from '../utils/slice';
import sel from '../utils/sel';


// prototype for both views and components
export const protoComponent = assign({}, base, {
    //
    // hooks
    render () {},
    childrenMounted () {},
    mounted () {},
    destroy () {},
    //
    // Mount the component into an element
    // If this component is already mounted, or it is mounting, it does nothing
    mount: function (el, data, onMounted) {
        if (mounted(this)) warn('already mounted');
        else {
            var sel = this.select(el),
                directives = sel.directives(),
                dattrs = directives ? directives.attrs : attributes(el),
                model = this.model;
            let key, value, target;

            data = assign({}, sel.datum(), data);

            // override model keys from data object and element attributes
            for (key in model) {
                target = data[key] === undefined ? dattrs : data;
                if (target[key] !== undefined)
                    model[key] = maybeJson(pop(target, key));
            }

            // Create model
            this.model = model = this.parent.model.$child(model);

            if (isArray(this.props)) {
                this.props.forEach(prop => {
                    value = maybeJson(data[prop] === undefined ? dattrs[prop] : data[prop]);
                    if (value !== undefined) {
                        // data point to a model attribute
                        if (isString(value) && model[value]) value = model[value];
                        data[prop] = value;
                    }
                });
            }
            // give the model a name
            if (!model.name) model.name = this.name;
            //
            // create the new element from the render function
            var newEl = this.render(data, dattrs, el);
            if (isPromise(newEl)) {
                var self = this;
                return newEl.then(element => {
                    return compile(self, el, element, onMounted);
                });
            }
            else
                return compile(this, el, newEl, onMounted);
        }
    },
    //
    //  Mount an inner html into an element
    //  This function should be used with the view element as first parameter
    mountInner (sel, inner) {
        var el = sel.node();
        sel.html(inner);
        if (el.childNodes.length) {
            var children = slice(el.childNodes);
            var p = sel.view(this).selectAll(function(){return children;}).mount();
            return p ? p.then(() => {return sel;}) : sel;
        } else {
            return sel;
        }
    }
});

// factory of View and Component constructors
export function createComponent (name, o, prototype, coreDirectives) {
    if (isFunction(o)) o = {render: o};

    var obj = assign({}, o),
        classComponents = extendComponents(map(), pop(obj, 'components')),
        classDirectives = extendDirectives(map(), pop(obj, 'directives')),
        model = pop(obj, 'model'),
        props = pop(obj, 'props');

    function Component (options) {
        var parent = pop(options, 'parent'),
            components = map(parent ? parent.components : null),
            directives = map(parent ? parent.directives : coreDirectives),
            events = dispatch('message', 'mounted'),
            cache = {};

        classComponents.each((comp, key) => {
            components.set(key, comp);
        });
        classDirectives.each((comp, key) => {
            directives.set(key, comp);
        });
        extendComponents(components, pop(options, 'components'));
        extendDirectives(directives, pop(options, 'directives'));

        Object.defineProperties(this, {
            name : {
                get () {
                    return name;
                }
            },
            components: {
                get: function () {
                    return components;
                }
            },
            directives: {
                get: function () {
                    return directives;
                }
            },
            parent: {
                get: function () {
                    return parent;
                }
            },
            root: {
                get: function () {
                    return parent ? parent.root : this;
                }
            },
            cache: {
                get: function () {
                    return parent ? parent.cache : cache;
                }
            },
            props: {
                get: function () {
                    return props;
                }
            },
            uid: {
                get: function () {
                    return this.model.uid;
                }
            },
            events: {
                get: function () {
                    return events;
                }
            }
        });
        this.model = assign({}, isFunction(model) ? model() : model, pop(options, 'model'));
    }

    Component.prototype = assign({}, prototype, obj);

    function component (options) {
        return new Component(options);
    }

    component.prototype = Component.prototype;

    return component;
}


// Used by both Component and view

export function extendComponents (container, components) {
    map(components).each((obj, key) => {
        container.set(key, createComponent(key, obj, protoComponent));
    });
    return container;
}

export function extendDirectives (container, directives) {
    map(directives).each((obj, key) => {
        container.set(key, createDirective(obj));
    });
    return container;
}

// Finalise the binding between the view and the model
// inject the model into the view element
// call the mounted hook and can return a Promise
export function asView(vm, element, onMounted) {
    Object.defineProperty(sel(vm), 'el', {
        get: function () {
            return element;
        }
    });
    // Apply model to element and mount
    var p = vm.select(element).view(vm).mount(null, onMounted);
    if (isPromise(p)) return p.then(() => vmMounted(vm, onMounted));
    else vmMounted(vm, onMounted);
}

export function mounted (vm, onMounted) {
    if (vm.isMounted === undefined) {
        vm.isMounted = false;
        return false;
    }
    else if (vm.isMounted) {
        warn(`view ${vm.name} already mounted`);
    }
    else {
        vm.isMounted = true;
        // invoke mounted component hook
        vm.mounted();
        // invoke onMounted callback if available
        if (onMounted) onMounted(vm);
        // last invoke the view mounted events
        vm.events.call('mounted', undefined, vm, onMounted);
        // remove mounted events
        vm.events.on('mounted', null);
    }
    return true;
}

// Internals

//
//  Component/View mounted
//  =========================
//
//  This function is called when a component/view has all its children added
function vmMounted(vm, onMounted) {
    var parent = vm.parent;
    vm.childrenMounted();
    if (parent && !parent.isMounted) {
        parent.events.on(`mounted.${vm.uid}`, () => {
            mounted(vm, onMounted);
        });
    }
    else {
        mounted(vm, onMounted);
    }
}

// Compile a component model
// This function is called once a component has rendered the component element
function compile (cm, el, element, onMounted) {
    if (!element) return warn('render function must return a single HTML node. It returned nothing!');
    element = asSelect(element);
    if (element.size() !== 1) warn('render function must return a single HTML node');
    element = element.node();
    //
    // Insert before the component element
    el.parentNode.insertBefore(element, el);
    // remove the component element
    cm.select(el).remove();
    //
    return asView(cm, element, onMounted);
}


function attributes (element) {
    var attrs = {};
    let attr;
    for (let i = 0; i < element.attributes.length; ++i) {
        attr = element.attributes[i];
        attrs[attr.name] = attr.value;
    }
    return attrs;
}

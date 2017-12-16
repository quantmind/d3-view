import {isFunction, isArray, isObject, isString, pop, assign} from 'd3-let';
import {map} from 'd3-collection';
import {dispatch} from 'd3-dispatch';

import base from './transition';
import createDirective from './directive';
import asSelect from '../utils/select';
import maybeJson from '../utils/maybeJson';
import sel from '../utils/sel';
import dataAttributes from '../utils/data';
import viewEvents from './events';
import viewModel from '../model/main';
import Cache from './cache';


// prototype for both views and components
const protoComponent = {
    //
    // hooks
    render () {},
    childrenMounted () {},
    mounted () {},
    destroy () {},
    //
    // Mount the component into an element
    // If this component is already mounted, or it is mounting, it does nothing
    mount (el, data, onMounted) {
        if (mounted(this)) return;
        viewEvents.call('component-mount', undefined, this, el, data);
        var sel = this.select(el),
            directives = sel.directives(),
            dattrs = directives ? directives.attrs : attributes(el),
            parentModel = this.parent.model,
            datum = sel.datum();

        let props = this.props,
            model = this.model,
            modelData = assign(dataAttributes(dattrs), datum, data),
            key, value;

        data = assign({}, datum, data);

        // override model keys from data object and element attributes
        for (key in model) {
            value = pop(modelData, key);
            if (value !== undefined) {
                if (isString(value)) {
                    if (parentModel.$isReactive(value)) {
                        if (value !== key) model[key] = reactiveParentProperty(key, value);
                        else delete model[key];
                    } else model[key] = maybeJson(value);
                } else model[key] = value;
            }
        }

        // Create model
        this.model = model = this.createModel(model);
        if (isArray(props)) props = props.reduce((o, key) => {
            o[key] = undefined;
            return o;
        }, {});

        if (isObject(props)) {
            Object.keys(props).forEach(key => {
                value = maybeJson(modelData[key] === undefined ? (data[key] === undefined ? dattrs[key] : data[key]) : modelData[key]);
                if (value !== undefined) {
                    // data point to a model attribute
                    if (isString(value) && model[value]) value = model[value];
                    data[key] = value;
                } else if (props[key] !== undefined) {
                    data[key] = props[key];
                }
            });
        }
        //
        // create the new element from the render function
        var newEl = this.render(data, dattrs, el);
        if (!newEl.then) newEl = Promise.resolve(newEl);
        return newEl.then(element => compile(this, el, element, onMounted));
    },

    createModel (data) {
        var model = this.parent ? this.parent.model.$child(data) : viewModel(data);
        model.$$view = this;
        model.$$name = this.name;
        return model;
    }
};

// factory of View and Component constructors
export function createComponent (name, o, coreDirectives) {
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
            cache = parent ? null : new Cache;

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
        viewEvents.call('component-created', undefined, this);
    }

    Component.prototype = assign({}, base, protoComponent, obj);

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

//
//  Finalise the binding between the view and the model
//  inject the model into the view element
//  call the mounted hook and can return a Promise
export function asView(vm, element, onMounted) {

    Object.defineProperty(sel(vm), 'el', {
        get: function () {
            return element;
        }
    });
    // Apply model to element and mount
    return vm.select(element).view(vm).mount(null, onMounted).then(() => vmMounted(vm, onMounted));
}

export function mounted (vm, onMounted) {
    if (vm.isMounted === undefined) {
        vm.isMounted = false;
        return false;
    }
    else if (vm.isMounted) {
        vm.logWarn(`component already mounted`);
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
        // fire global event
        viewEvents.call('component-mounted', undefined, vm);
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
    if (!element) return cm.logWarn('render function must return a single HTML node. It returned nothing!');
    element = asSelect(element);
    if (element.size() !== 1) cm.logWarn('render function must return a single HTML node');
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


function reactiveParentProperty (key, value) {
    return {
        reactOn: [value],
        get () {
            return this[value];
        },
        set () {
            this.$$view.logError(`Cannot set "${key}" value because it is owned by a parent model`);
        }
    };
}

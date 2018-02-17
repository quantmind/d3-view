import {isFunction, isArray, isObject, isString, pop, assign} from 'd3-let';
import {dispatch} from 'd3-dispatch';

import './selection';
import base from './transition';
import createDirective from './directive';
import asSelect from '../utils/select';
import maybeJson from '../utils/maybeJson';
import sel from '../utils/sel';
import map from '../utils/map';
import dataAttributes from '../utils/data';
import viewEvents from './events';
import viewModel from '../model/main';
import Cache from './cache';


export const protoView = {
    doMount (el) {
        return asView(this, el);
    }
};


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
    mount (el, data) {
        if (mounted(this)) return;
        el = asSelect(el).node();
        if (!el) {
            this.logWarn(`element not defined, pass an identifier or an HTMLElement object`);
            return Promise.resolve(this);
        }
        // set the owner document
        this.ownerDocument = el.ownerDocument;
        // fire mount events
        this.events.call('mount', undefined, this, el, data);
        // remove mounted events
        this.events.on('mount', null);
        // fire global mount event
        viewEvents.call('component-mount', undefined, this, el, data);
        //
        var sel = this.select(el),
            directives = sel.directives(),
            dattrs = directives ? directives.attrs : attributes(el),
            datum = sel.datum();

        let propsData = assign(dataAttributes(dattrs), datum, data),
            modelData = {},
            key, value, parentModel;

        // pick parent model
        if (this.parent) {
            if (propsData.model) parentModel = this.parent.model[pop(propsData, 'model')];
            if (!parentModel) parentModel = this.parent.model;
        }

        // override model keys from object and element attributes
        for (key in this.model) {
            value = pop(propsData, key);
            if (value !== undefined) {
                if (isString(value) && parentModel) {
                    if (parentModel.$isReactive(value)) {
                        if (value !== key) modelData[key] = reactiveParentProperty(key, value);
                    } else modelData[key] = maybeJson(value);
                } else modelData[key] = value;
            } else if (!parentModel || parentModel[key] === undefined)
                modelData[key] = this.model[key];
        }

        // Create model
        this.model = parentModel ? parentModel.$child(modelData) : viewModel(modelData);
        this.model.$$view = this;
        this.model.$$name = this.name;

        // get props object from model if available
        modelData = propsData.props ? this.model[pop(propsData, 'props')] || {} : {};

        Object.keys(this.props).forEach(key => {
            value = modelData[key];
            if (value === undefined) {
                value = maybeJson(propsData[key] === undefined ? dattrs[key] : propsData[key]);
                if (value !== undefined) {
                    // data point to a model attribute
                    if (isString(value) && this.model[value]) value = this.model[value];
                    propsData[key] = value;
                    // default value if available
                } else if (this.props[key] !== undefined) {
                    propsData[key] = this.props[key];
                }
            } else
                propsData[key] = value;
        });
        // Add once only directive values
        if (directives) directives.once(this.model, propsData);
        //
        // create the new element from the render function
        this.props = propsData;
        return this.doMount(el, dattrs);
    },

    doMount (el, dattrs) {
        let newEl;
        try {
            newEl = this.render(this.props, dattrs, el);
        } catch (error) {
            newEl = Promise.reject(error);
        }
        if (!newEl || !newEl.then) newEl = Promise.resolve(newEl);
        return newEl
            .then(element => compile(this, el, element))
            .catch (exc => error(this, el, exc));
    },

    use (plugin) {
        if (isObject(plugin)) plugin.install(this);
        else plugin(this);
        return this;
    },

    addComponent (name, obj) {
        var component = createComponent(name, obj);
        this.components.set(name, component);
        return component;
    },

    addDirective (name, obj) {
        var directive = createDirective(obj);
        this.directives.set(name, directive);
        return directive;
    }
};

// factory of View and Component constructors
export function createComponent (name, o, coreDirectives, coreComponents) {
    if (isFunction(o)) o = {render: o};

    var obj = assign({}, o),
        classComponents = extendComponents(new Map, pop(obj, 'components')),
        classDirectives = extendDirectives(new Map, pop(obj, 'directives')),
        model = pop(obj, 'model'),
        props = pop(obj, 'props');

    function Component (options) {
        var parent = pop(options, 'parent'),
            components = map(parent ? parent.components : coreComponents),
            directives = map(parent ? parent.directives : coreDirectives),
            events = dispatch('message', 'mount', 'mounted'),
            cache = parent ? null : new Cache;

        classComponents.forEach((comp, key) => {
            components.set(key, comp);
        });
        classDirectives.forEach((comp, key) => {
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
                get () {
                    return components;
                }
            },
            directives: {
                get () {
                    return directives;
                }
            },
            parent: {
                get () {
                    return parent;
                }
            },
            root: {
                get () {
                    return parent ? parent.root : this;
                }
            },
            cache: {
                get () {
                    return parent ? parent.cache : cache;
                }
            },
            uid: {
                get () {
                    return this.model.uid;
                }
            },
            events: {
                get () {
                    return events;
                }
            }
        });
        this.props = asObject(props, pop(options, 'props'));
        this.model = asObject(model, pop(options, 'model'));
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

export const extendComponents = (container, components) => {
    map(components).forEach((obj, key) => {
        container.set(key, createComponent(key, obj, protoComponent));
    });
    return container;
};

export const extendDirectives = (container, directives) => {
    map(directives).forEach((obj, key) => {
        container.set(key, createDirective(obj));
    });
    return container;
};

//
//  Finalise the binding between the view and the model
//  inject the model into the view element
//  call the mounted hook and can return a Promise
export const asView = (vm, element) => {

    Object.defineProperty(sel(vm), 'el', {
        get: function () {
            return element;
        }
    });
    // Apply model to element and mount
    return vm.select(element).view(vm).mount().then(() => vmMounted(vm));
};

export const mounted = (vm) => {
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
        // invoke the view mounted events
        vm.events.call('mounted', undefined, vm);
        // remove mounted events
        vm.events.on('mounted', null);
        // fire global event
        viewEvents.call('component-mounted', undefined, vm);
    }
    return true;
};

// Internals

//
//  Component/View mounted
//  =========================
//
//  This function is called when a component/view has all its children added
const vmMounted = (vm) => {
    var parent = vm.parent;
    vm.childrenMounted();
    if (parent && !parent.isMounted)
        parent.events.on(`mounted.${vm.uid}`, () => {
            mounted(vm);
        });
    else
        mounted(vm);
    return vm;
};

// Compile a component model
// This function is called once a component has rendered the component element
const compile = (cm, origEl, element) => {
    if (isString(element)) {
        const props = Object.keys(cm.props).length ? cm.props : null;
        element = cm.viewElement(element, props, origEl.ownerDocument);
    }
    element = asSelect(element);
    const size = element.size();
    if (!size) throw new Error('render() must return a single HTML node. It returned nothing!');
    else if (size !== 1) cm.logWarn('render() must return a single HTML node');
    element = element.node();
    //
    // mark the original element as component
    origEl.__d3_component__ = true;
    // Insert before the component element
    origEl.parentNode.insertBefore(element, origEl);
    // remove the component element
    cm.select(origEl).remove();
    //
    return asView(cm, element);
};


// Invoked when a component cm has failed to render
const error = (cm, origEl, exc) => {
    cm.logWarn(`failed to render due to the unhandled exception reported below`);
    cm.logError(exc);
    viewEvents.call('component-error', undefined, cm, origEl, exc);
    return cm;
};


const attributes = element => {
    const attrs = {};
    let attr;
    for (let i = 0; i < element.attributes.length; ++i) {
        attr = element.attributes[i];
        attrs[attr.name] = attr.value;
    }
    return attrs;
};


const reactiveParentProperty = (key, value) => {
    return {
        reactOn: [value],
        get () {
            return this[value];
        },
        set () {
            this.$$view.logError(`Cannot set "${key}" value because it is owned by a parent model`);
        }
    };
};


const asObject = (value, opts) => {
    if (isFunction(value)) value = value();
    if (isArray(value))
        value = value.reduce((o, key) => {
            o[key] = undefined;
            return o;
        }, {});
    return assign({}, value, opts);
};

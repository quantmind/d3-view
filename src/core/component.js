import {isFunction, isArray, isPromise, pop, assign} from 'd3-let';
import {select} from 'd3-selection';
import {map} from 'd3-collection';
import {dispatch} from 'd3-dispatch';

import createDirective from './directive';
import createModel from './model';
import mount from './mount';
import getdirs from './getdirs';
import directives from '../directives/index';
import warn from '../utils/warn';
import asSelect from '../utils/select';
import providers from '../utils/providers';
import maybeJson from '../utils/maybeJson';
import sel from '../utils/sel';
import {htmlElement} from '../utils/html';


// Core Directives
const coreDirectives = extendDirectives(map(), directives);

// prototype for both views and components
export const protoComponent = {
    isd3: true,
    providers: providers,
    htmlElement: htmlElement,
    // same as export
    viewElement: htmlElement,

    init: function () {
    },

    mounted: function () {
    },

    createElement: function (tag) {
        return select(document.createElement(tag));
    },

    responseError (response) {
        var self = this;
        response.json().then((data) => {
            self.error(data, response);
        });
    },

    error (data) {
        data.level = 'error';
        this.message(data);
    },

    message (data) {
        var self = this;
        this.root.events.call('message', self, data);
    },

    // Shortcut for fetch function in providers
    fetch (url, options) {
        var fetch = providers.fetch;
        return arguments.length == 1 ? fetch(url) : fetch(url, options);
    },

    render: function () {

    },

    mount: function (el) {
        if (mounted(this)) warn('already mounted');
        else {
            var parent = this.parent ? this.parent.model : null,
                directives = getdirs(el, this.directives),
                model = createModel(directives, this.model, parent);
            //
            this.model = model;
            //
            // When a for d3-for loop is active we abort mounting this component
            // The component will be mounted as many times the the for loop requires
            if (mount(this.model, el)) return;

            var data = select(el).datum() || {};

            if (isArray(this.props)) {
                var key, value;
                this.props.forEach((prop) => {
                    key = directives.attrs[prop];
                    if (model[key]) value = model[key];
                    else value = maybeJson(key);
                    data[prop] = value;
                });
            }
            //
            // create the new element from the render function
            var newEl = this.render(data, directives.attrs);
            if (isPromise(newEl)) {
                var self = this;
                newEl.then((element) => {
                    compile(self, el, element);
                });
            }
            else compile(this, el, newEl);
        }
        return this;
    }
};

// factory of View and Component constructors
export function createComponent (o, prototype) {
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
            events = dispatch('message');

        classComponents.each((comp, key) => {
            components.set(key, comp);
        });
        classDirectives.each((comp, key) => {
            directives.set(key, comp);
        });
        extendComponents(components, pop(options, 'components'));
        extendDirectives(directives, pop(options, 'directives'));

        Object.defineProperties(this, {
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
        this.model = assign({}, model, pop(options, 'model'));
        this.init(options);
    }

    Component.prototype = assign({}, prototype, obj);

    function component (options) {
        return new Component(options);
    }

    component.prototype = Component.prototype;

    return component;
}


export function mounted (view) {
    var mounted = view.isMounted;
    if (!mounted)
        Object.defineProperty(view, 'isMounted', {
            get: function () {
                return true;
            }
        });
    return mounted;
}


function extendComponents (container, components) {
    map(components).each((obj, key) => {
        container.set(key, createComponent(obj, protoComponent));
    });
    return container;
}

function extendDirectives (container, directives) {
    map(directives).each((obj, key) => {
        container.set(key, createDirective(obj));
    });
    return container;
}


export function asView(vm, element) {
    var model = vm.model;

    Object.defineProperty(sel(vm), 'el', {
        get: function () {
            return element;
        }
    });

    Object.defineProperty(model, '$vm', {
        get: function () {
            return vm;
        }
    });

    // Apply model to element
    select(element).model(model);

    mount(model, element);
}


// Compile a component model
// This function is called once a component has rendered the component element
function compile (cm, el, element) {
    if (!element) return warn('render function must return a single HTML node. It returned nothing!');
    element = asSelect(element);
    if (element.size() !== 1) warn('render function must return a single HTML node');
    element = element.node();
    //
    // Insert before the component element
    el.parentNode.insertBefore(element, el);
    // remove the component element
    select(el).remove();
    //
    asView(cm, element);
    //
    // mounted hook
    cm.mounted();
}

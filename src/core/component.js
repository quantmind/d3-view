import {isFunction, isObject, isArray, pop, assign} from 'd3-let';
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
const proto = {
    isd3: true,
    providers: providers,
    htmlElement: htmlElement,

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
        this.message(data);
    },

    message (data) {
        var self = this;
        this.root.events.call('message', self, data);
    }
};


//
// prototype for views
const protoView = assign({}, proto, {

    use: function (plugin) {
        if (isObject(plugin)) plugin.install(this);
        else plugin(this);
        return this;
    },

    addComponent: function (name, obj) {
        if (this.isMounted) return warn('already mounted, cannot add component');
        var component = createComponent(obj, protoComponent);
        this.components.set(name, component);
        return component;
    },

    addDirective: function (name, obj) {
        if (this.isMounted) return warn('already mounted, cannot add directive');
        var directive = createDirective(obj);
        this.directives.set(name, directive);
        return directive;
    },

    mount: function (el) {
        if (mounted(this)) warn('already mounted');
        else {
            el = element(el);
            if (el) {
                var parent = this.parent ? this.parent.model : null;
                this.model = createModel(getdirs(el, this.directives), this.model, parent);
                asView(this, el);
            }
        }
        return this;
    }
});

//
// prototype for components
const protoComponent = assign({}, proto, {

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
            if (!newEl) return warn('render function must return a single HTML node. It returned nothing!');
            newEl = asSelect(newEl);
            if (newEl.size() !== 1) warn('render function must return a single HTML node');
            newEl = newEl.node();
            //
            // Insert before the component element
            el.parentNode.insertBefore(newEl, el);
            // remove the component element
            select(el).remove();
            //
            // Mount
            asView(this, newEl);
        }
        return this;
    }
});

// factory of View and Component constructors
export function createComponent (obj, prototype) {
    prototype = prototype || protoView;
    if (isFunction(obj)) obj = {render: obj};

    var classComponents = extendComponents(map(), pop(obj, 'components')),
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


function asView(vm, element) {
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
    //
    // mounted hook
    vm.mounted();
}


function element (el) {
    if (!el) return warn(`element not defined, pass an identifier or an HTMLElement object`);
    var d3el = isFunction(el.node) ? el : select(el),
        element = d3el.node();
    if (!element) warn(`could not find ${el} element`);
    else return element;
}


function mounted (view) {
    var mounted = view.isMounted;
    if (!mounted)
        Object.defineProperty(view, 'isMounted', {
            get: function () {
                return true;
            }
        });
    return mounted;
}

import assign from 'object-assign';
import {isFunction, isArray, isPromise, isString, pop} from 'd3-let';
import {select} from 'd3-selection';
import {map} from 'd3-collection';
import {dispatch} from 'd3-dispatch';

import createDirective from './directive';
import warn from '../utils/warn';
import asSelect from '../utils/select';
import providers from '../utils/providers';
import maybeJson from '../utils/maybeJson';
import sel from '../utils/sel';
import {htmlElement} from '../utils/html';


// prototype for both views and components
export const protoComponent = {
    isd3: true,
    providers: providers,
    htmlElement: htmlElement,
    // same as export
    viewElement: htmlElement,
    createElement (tag) {
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

    //
    // render a template from a url
    renderFromUrl (url, context) {
        var cache = this.cache;
        if (url in cache)
            return new Promise((resolve) => resolve(htmlElement(cache[url])));
        return this.fetch(url).then(response => response.text()).then(template => {
            cache[url] = template;
            return htmlElement(template, context);
        });
    },
    //
    // hooks
    init () {},
    render () {},
    mounted () {},
    //
    mount: function (el, data) {
        if (mounted(this)) warn('already mounted');
        else {
            var sel = select(el),
                directives = sel.directives(),
                dattrs = directives ? directives.attrs : attributes(el),
                model = this.parent.model.$child(this.model);

            data = assign({}, sel.datum(), data);

            this.model = model;

            if (isArray(this.props)) {
                var key, value;
                this.props.forEach(prop => {
                    key = data[prop] === undefined ? dattrs[prop] : data[prop];
                    if (isString(key)) {
                        if (model[key]) value = model[key];
                        else value = maybeJson(key);
                    } else
                        value = key;
                    if (value !== undefined) {
                        data[prop] = value;
                        if (model.$events.has(prop)) model[prop] = value;
                    }
                });
            }
            //
            // create the new element from the render function
            var newEl = this.render(data, dattrs);
            if (isPromise(newEl)) {
                var self = this;
                return newEl.then((element) => {
                    return compile(self, el, element);
                });
            }
            else
                return compile(this, el, newEl);
        }
    }
};

// factory of View and Component constructors
export function createComponent (o, prototype, coreDirectives) {
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


export function extendComponents (container, components) {
    map(components).each((obj, key) => {
        container.set(key, createComponent(obj, protoComponent));
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
export function asView(vm, element) {
    Object.defineProperty(sel(vm), 'el', {
        get: function () {
            return element;
        }
    });
    // Apply model to element and mount
    var p = select(element).view(vm).mount();
    if (isPromise(p))
        return p.then(() => {
            return vm.mounted();
        });
    else
        return vm.mounted();
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
    return asView(cm, element);
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

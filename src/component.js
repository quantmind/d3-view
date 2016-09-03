import {isFunction, isObject} from 'd3-let';
import {select} from 'd3-selection';
import {map} from 'd3-collection';
import Directive from './directive';
import Model from './model';
import getdirs from './getdirs';
import {warn, asSelect} from './utils';
import directives from './directives/index';
import providers from './utils';

const components = {};

//
//  d3 base view class
export class View {

    constructor(options) {
        options = map(options);
        var el = options.get('el');
        if (!el) this.warn('"el" element is required when creating a new d3.View');
        else {
            var d3el = isFunction(el.node) ? el : select(el);
            var element = d3el.node();
            if (!element) this.warn(`could not find ${el} element`);
            else init.call(this, element, options);
        }
    }
    // hooks

    init () {}

    created () {}

    beforeMount () {}

    mounted () {}

    // Static API
    static get providers () {
        return providers;
    }

    static get directives () {
        return directives;
    }

    static get components () {
        return components;
    }

    // API
    warn (msg) {
        warn(msg);
    }

    get isd3() {
        return true;
    }

    get model () {
        return this.sel.model();
    }

    get components () {
        return this.model.$components;
    }

    get directives () {
        return this.model.$directives;
    }

    get uid () {
        return this.model.uid;
    }

    get sel () {
        return select(this.el);
    }

    mount () {
        if (mounted(this)) this.warn('already mounted');
        else if (this.el) {
            this.beforeMount();
            this.model.$mount(this.el);
            this.mounted();
        }
        return this;
    }

    createElement (tag) {
        return select(document.createElement(tag));
    }
}


//  d3 view Component
//  =======================
//
//  A component must implement the render method
export class Component extends View {

    render () {}

    mount () {
        if (mounted(this)) this.warn('already mounted');
        else {
            // before mount hook
            this.beforeMount();

            var model = this.model,
                el = this.el;
            //
            // When a for d3-for loop is active we abort mounting this component
            // The component will be mounted as meny times the the for loop requires
            if(model.$mount(el)) return;
            //
            // create the new element from the render function
            el = this.render();
            if (!el) this.warn('render function must return a single HTML node. It returned nothing!');
            el = asSelect(el);
            if (el.size() !== 1) this.warn('render function must return a single HTML node');
            var node = el.node();
            //
            // remove the component element
            this.el.parentNode.appendChild(node);
            this.sel.remove();
            //
            // Mount the new element
            model.$mount(node);
            //
            // mounted hook
            this.mounted();
        }
        return this;
    }
}

// d3-view Constructor
function init(element, options) {
    this.init();

    var data = options.get('model'),
        parent = options.get('parent'),
        directives = map(parent ? parent.$directives : this.constructor.directives),
        components = map(parent ? parent.$components : this.constructor.components);

    extendDirectivesComponents(options, directives, components);

    var model = Model.create(getdirs(element, directives), parent, data);
    model.$directives = directives;
    model.$components = components;

    Object.defineProperty(this, 'el', {
        get: function () {
            return element;
        }
    });

    // Apply model to element
    this.sel.model(model);
    // Created hook
    this.created();
}


function extendDirectivesComponents (options, directives, components) {
    //
    map(options.get('directives')).each((directive, key) => {
        if (isObject(directive))
            // Create a new directive class
            directives.set(key, class extends Directive {

                init () {
                    for (key in directive)
                        this[key] = directive[key];
                }
            });
        else
            warn(`"${key}" not a valid directive. Must be a object with some of "create", "mount" and "destroy" functions`);
    });
    //
    map(options.get('components')).each((component, key) => {
        if (component.prototype && component.prototype.isd3)
            components.set(key, component);
        else {
            if (isFunction(component)) component = {render: component};
            if (isObject(component) && isFunction(component.render))
            // Create a new directive class
                components.set(key, class extends Component {

                    init() {
                        var init;
                        for (key in component) {
                            if (key === 'init') init = component[key];
                            else this[key] = component[key];
                        }
                        if (init) init.call(this);
                    }

                });
            else
                warn(`"${key}" not a valid component. Must be a function or an object with render function`);
        }
    });
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

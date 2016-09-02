import {isFunction, isObject} from 'd3-let';
import {select} from 'd3-selection';
import {map} from 'd3-collection';
import Directive from './directive';
import Model from './model';
import getdirs from './getdirs';
import {warn, asSelect, isCreator} from './utils';

//
//  d3 base view class
export class Base {

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

    warn (msg) {
        warn(msg);
    }

    get isd3() {
        return true;
    }

    get model () {
        return this.sel.model();
    }

    get uid () {
        return this.model.uid;
    }

    get sel () {
        return select(this.el);
    }

    get parent () {
        var p = this.model.parent;
        return p ? p.$vm : undefined;
    }

    get root () {
        let parent = this.parent;
        if (parent) return parent.root;
        else return this;
    }

    mount () {
        if (this.isMounted) this.warn('already mounted');
        else if (this.el) {
            this.beforeMount();
            Object.defineProperty(this, 'isMounted', {
                get: function () {
                    return true;
                }
            });
            this.model.$mount(this.el);
            this.mounted();
        }
        return this;
    }

    createElement (tag) {
        return select(document.createElement(tag));
    }
}


// d3 view component
export class Component extends Base {

    render () {}

    mount () {
        if (this.isMounted) this.warn('already mounted');
        else {
            this.beforeMount();
            this.model.$mounted = true;
            this.model.$mount(this.el);
            if (isCreator(this.el)) return;
            var el = this.render();
            if (!el) this.warn('render function must return a single HTML node. It returned nothing!');
            el = asSelect(el);
            if (el.size() !== 1) this.warn('render function must return a single HTML node');
            var node = el.node();
            this.el.parentNode.appendChild(node);
            select(this.el).remove();
            this.model.$mount(node);
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

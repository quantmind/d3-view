import {isFunction, isObject} from 'd3-let';
import {select} from 'd3-selection';
import {map} from 'd3-collection';
import Directive from './directive';
import Model from './model';
import {warn} from './utils';

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

    get uid () {
        return this.model.uid;
    }

    get el () {
        return this.model.$el;
    }

    get sel () {
        return select(this.el);
    }

    get parent () {
        var p = this.model.parent;
        return p ? p.$vm : undefined;
    }

    get components () {
        return this.model.$components;
    }

    get root () {
        let parent = this.parent;
        if (parent) return parent.root;
        else return this;
    }

    get isMounted () {
        return this.model.$mounted;
    }

    mount () {
        if (this.isMounted) this.warn('already mounted');
        else if (this.el) {
            this.beforeMount();
            this.model.$mounted = true;
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
            var el = this.render();
            if (!el || el.size() !== 1) this.warn('render function must return a single HTML node');
            var node = el.node();
            this.el.parentNode.appendChild(node);
            select(this.el).remove();
            this.model.$el = node;
            this.mounted();
        }
        return this;
    }
}


function init(element, options) {
    this.init();
    // model containing binding data
    var vm = this,
        data = options.get('model'),
        parent = options.get('parent');
    var model = parent ? parent.$child(data) : new Model(data);

    Object.defineProperty(this, 'model', {
        get: function () {
            return model;
        }
    });

    model.$vm = vm;
    model.$el = element;
    model.$directives = map(parent ? parent.$directives : this.constructor.directives);
    model.$components = map(parent ? parent.$components : this.constructor.components);
    model.$mounted = false;
    //
    map(options.get('directives')).each((directive, key) => {
        if (isObject(directive))
            // Create a new directive class
            model.$directives.set(key, class extends Directive {

                init () {
                    for (key in directive)
                        this[key] = directive[key];
                }
            });
        else
            vm.warn(`"${key}" not a valid directive. Must be a object with some of "create", "mount" and "destroy" functions`);
    });
    //
    map(options.get('components')).each((component, key) => {
        if (component.prototype && component.prototype.isd3)
            model.$components.set(key, component);
        else {
            if (isFunction(component)) component = {render: component};
            if (isObject(component) && isFunction(component.render))
            // Create a new directive class
                model.$components.set(key, class extends Component {

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
                vm.warn(`"${key}" not a valid component. Must be a function or an object with render function`);
        }
    });
    this.created();
}

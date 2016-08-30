import {isFunction, isObject, self} from 'd3-let';
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
        self.set(this, {});
        var el = options.get('el');
        if (!el) this.warn('"el" element is required when creating a new d3.View');
        else {
            var d3el = isFunction(el.node) ? el : select(el);
            var element = d3el.node();
            if (!element) this.warn(`could not find ${el} element`);
            else this._init(element, options);
        }
    }

    created () {}

    beforeMount () {}

    mounted () {}

    warn(msg) {
        if (this.parent) this.parent.warn(msg);
        else warn(msg);
    }

    get isd3() {
        return true;
    }

    get model () {
        return self.get(this);
    }

    get uid () {
        return this.model.$uid;
    }

    get el () {
        return this.model.$el;
    }

    get parent () {
        return this.model.$parent;
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
            mount(this, this.el);
            this.mounted();
        }
        return this;
    }

    createElement (tag) {
        return select(document.createElement(tag));
    }

    _init (element, options) {
        init.call(this, element, options);
    }
}


// d3 view component
class Component extends Base {

    mount () {
        if (this.isMounted) this.warn('already mounted');
        else {
            this.beforeMount();
            this.model.$mounted = true;
            mount(this, this.el);
            var el = this.render();
            if (!el || el.size() !== 1) this.warn('render function must return a single HTML node');
            var node = el.node();
            node.__d3view__ = this;
            this.el.parentNode.appendChild(node);
            select(this.el).remove();
            this.model.$el = node;
            this.mounted();
        }
        return this;
    }
}


function init(element, options) {
    // model containing binding data
    var vm = this;
    var model = new Model(this, options.get('model'));
    self.set(this, model);
    model.$directives = map(this.constructor.directives);
    model.$components = map(this.constructor.components);
    model.$mounted = false;
    model.$el = element;
    element.__d3view__ = this;
    var parent = options.get('parent');
    if (parent) model.$parent = parent.model;
    //
    map(options.get('directives')).each((directive, key) => {
        // Create a new directive class
        model.$directives[key] = class extends Directive {
            mount () {
                return directive.call(this);
            }
        };
    });
    //
    map(options.get('components')).each((component, key) => {
        if (isFunction(component)) component = {render: component};
        if (isObject(component) && isFunction(component.render))
            // Create a new directive class
            model.$components.set(key, class extends Component {

                _init (element, options) {
                    for (key in component)
                        this[key] = component[key];
                    init.call(this, element, options);
                }

            });
        else
            vm.warn(`"${key}" not a valid component. Must be a function or an object with render function`);
    });
    this.created();
}


function mount (vm, el) {
    var components = vm.model.$components,
        dirs = vm.model.$directives;

    select(el).selectAll('*').each(function() {
        // mount components
        var Component = components.get(this.tagName.toLowerCase());

        if (Component)
            new Component({
                el: this,
                parent: vm
            }).mount();
        else
            mount(vm, this);
    });
    // apply directive to this element
    for (let i=0; i<el.attributes.length; ++i) {
        let attr = el.attributes[i],
            dirName = attr.name.substring(0, 3) === 'd3-' ? attr.name.substring(3) : null,
            Directive = dirs.get(dirName);
        if (Directive)
            new Directive(vm, el, attr);
    }
}

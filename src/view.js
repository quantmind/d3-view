import {select} from 'd3-selection';
import {self} from 'd3-let';
import {version} from '../package.json';
import {map} from 'd3-collection';
import {isFunction} from 'd3-let';
import Base from './logger';
import Model from './model';
import directives from './directives/index';


//
//  d3 view class
export class View extends Base {

    constructor (options) {
        super();
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

    get isd3 () {
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

    get root () {
        let parent = this.parent;
        if (parent) return parent.root;
        else return this;
    }

    get mounted () {
        return this.model.$mounted;
    }

    mount () {
        if (this.mounted) this.warn('already mounted');
        else {
            this.model.$mounted = true;
            mount(this, this.el);
        }
        return this;
    }
}


View.version = version;
View.directives = directives;
View.components = {};


function init(element, options) {
    // model containing binding data
    var model = new Model(this, options.get('model'));
    self.set(this, model);
    model.$directives = map();
    model.$mounted = false;
    model.$el = element;
    element._d3v_ = this;
    var parent = options.parent;
    if (parent) model.$parent = parent.model;
}


function mount (vm, el) {
    var components = vm.constructor.components,
        dirs = vm.constructor.directives;

    select(el).selectAll('*').each(function() {
        // mount components
        var Component = components[this.tagName];

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
            Directive = dirName ? dirs[dirName] : null;
        if (Directive)
            new Directive(vm, el, attr);
    }
}

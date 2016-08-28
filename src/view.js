import {select} from 'd3-selection';
import {self} from 'd3-let';
import {version} from '../package.json';
import {map} from 'd3-collection';
import Base from './logger';
import directives from './directives/index';

let uid = 0;
//
//  d3 view class
export class View extends Base {

    constructor (options) {
        super();
        options = map(options);
        var el = options.get('el');
        if (!el) this.warn('"el" element is required when creating a new d3.View');
        else {
            var element = select(el).node();
            if (!element) this.warn(`could not find ${el} element`);
            else init.call(this, element, options);
        }
    }

    get isd3 () {
        return true;
    }

    get scope () {
        return self.get(this);
    }

    get uid () {
        return this.scope.$uid;
    }

    get el () {
        return this.scope.$el;
    }

    get parent () {
        return this.scope.$parent;
    }

    get root () {
        let parent = this.parent;
        if (parent) return parent.root;
        else return this;
    }

    get mounted () {
        return this.scope.$mounted;
    }

    mount () {
        if (this.mounted) return this.warn('already mounted');
        this.scope.$mounted = true;
        mount(this, this.el);
    }
}


View.version = version;
View.directives = directives;
View.components = {};


function init(element, options) {
    // scope containing binding data
    let scope = {};
    self.set(this, scope);
    scope.$mounted = false;
    scope.$el = element;
    scope.$uid = ++uid;
    element._d3v_ = this;
    var parent = options.parent;
    if (parent) scope.$parent = parent.scope;
}


function mount (vm, el) {
    var components = vm.constructor.components,
        dirs = vm.constructor.directives;

    select(el).selectAll(function() {
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
    el.attributes.forEach((attr) => {
        var directive = dirs[attr.name];
        if (directive) directive.bind(parent.el);
    });
}

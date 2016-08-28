import {select} from 'd3-selection';
import {self} from 'd3-let';
import {version} from '../package.json';
import {map} from 'd3-collection';
import directives from './directives';
import Base from './logger';

let uid = 0;
//
//  d3 view class
export default class View extends Base {

    constructor (options) {
        super();
        options = map(options);
        var el = options.get('el');
        if (!el) this.warn('element is required when creating a new d3.View');
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
}


View.version = version;
View.directives = directives;


function init(element, options) {
    // scope containing binding data
    let scope = {};
    self.set(this, scope);
    scope.$el = element;
    scope.$uid = ++uid;
    element._d3v_ = this;
    this.parent = options.parent;
}

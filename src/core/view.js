import {isObject, isFunction} from 'd3-let';
import {select} from 'd3-selection';

import './selection';
import {createComponent, mounted, asView} from './component';
import viewEvents from './events';
import createDirective from './directive';
import viewModel from '../model/main';
import warn from '../utils/warn';

//
// prototype for views
export default {

    use: function (plugin) {
        if (isObject(plugin)) plugin.install(this);
        else plugin(this);
        return this;
    },

    addComponent: function (name, obj) {
        var component = createComponent(name, obj);
        this.components.set(name, component);
        return component;
    },

    addDirective: function (name, obj) {
        var directive = createDirective(obj);
        this.directives.set(name, directive);
        return directive;
    },

    mount: function (el, callback) {
        if (mounted(this)) warn('already mounted');
        else {
            viewEvents.call('component-mount', undefined, this, el);
            el = element(el);
            if (el) {
                this.model = this.parent ? this.parent.model.$child(this.model) : viewModel(this.model);
                return asView(this, el, callback);
            }
        }
    }
};


function element (el) {
    if (!el) return warn(`element not defined, pass an identifier or an HTMLElement object`);
    var d3el = isFunction(el.node) ? el : select(el),
        element = d3el.node();
    if (!element) warn(`could not find ${el} element`);
    else return element;
}

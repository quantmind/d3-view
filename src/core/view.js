import {assign, isObject, isFunction} from 'd3-let';
import {select} from 'd3-selection';

import {createComponent, protoComponent, mounted, asView} from './component';
import createDirective from './directive';
import getdirs from './getdirs';
import createModel from './model';
import warn from '../utils/warn';

//
// prototype for views
const protoView = assign({}, protoComponent, {

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

// the view constructor
export default createComponent(null, protoView);


function element (el) {
    if (!el) return warn(`element not defined, pass an identifier or an HTMLElement object`);
    var d3el = isFunction(el.node) ? el : select(el),
        element = d3el.node();
    if (!element) warn(`could not find ${el} element`);
    else return element;
}

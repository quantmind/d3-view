import {isObject} from 'd3-let';

import './selection';
import {createComponent, mounted, asView} from './component';
import viewEvents from './events';
import createDirective from './directive';
import asSelect from '../utils/select';

//
// prototype for views
export default {

    use (plugin) {
        if (isObject(plugin)) plugin.install(this);
        else plugin(this);
        return this;
    },

    addComponent (name, obj) {
        var component = createComponent(name, obj);
        this.components.set(name, component);
        return component;
    },

    addDirective (name, obj) {
        var directive = createDirective(obj);
        this.directives.set(name, directive);
        return directive;
    },

    mount (el, callback) {
        if (mounted(this)) return;
        if (!el) return this.logWarn(`element not defined, pass an identifier or an HTMLElement object`);
        el = asSelect(el).node();
        if (!el) return this.logWarn(`element not defined, pass an identifier or an HTMLElement object`);
        viewEvents.call('component-mount', undefined, this, el);
        this.model = this.createModel(this.model);
        return asView(this, el, callback);
    }
};

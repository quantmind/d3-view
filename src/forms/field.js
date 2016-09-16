import {select, selectAll} from 'd3-selection';
import {assign} from 'd3-let';

import warn from './warn';
import {modelData} from './utils';


export const formElement = {

    wrap (sel) {
        var field = this,
            theme = getTheme(field),
            wrappers = theme ? theme[sel.attr('type')] || theme[sel.node().tagName.toLowerCase()] : null;
        if (!wrappers || !theme.wrappers) return sel;

        var wrapped = sel,
            wrap;

        wrappers.forEach((wrapper) => {
            wrap = theme.wrappers[wrapper];
            if (wrap) wrapped = wrap.call(field, wrapped, sel);
            else warn(`Could not find form field wrapper ${wrapper}`);
        });

        return wrapped;
    },

    wrapTemplate (sel, template) {
        var div = document.createElement('div'),
            outer = select(div).html(template),
            slot = outer.select('slot');

        if (!slot.size()) {
            warn('template does not provide a slot element');
            return sel;
        }
        var target = select(slot.node().parentNode);
        sel.nodes().forEach(function (node) {
            target.insert(() => {return node;}, 'slot');
        });
        slot.remove();
        return selectAll(div.children);
    },
};

// A mixin for all form field components
export default assign({

    model: {
        error: '',
        isDirty: false,
        showError: {
            reactOn: ['error', 'isDirty', 'formSubmitted'],
            get () {
                if (this.error) return this.isDirty || this.formSubmitted;
                return false;
            }
        }
    },

    mounted () {
        this.model.$on('value', function () {
            this.isDirty = true;
        });
    },

    inputData (data) {
        data = modelData.call(this, data);
        if (!data.name) warn ('Input field without a name');
        data.placeholder = data.placeholder || data.label || data.name;
        data.id = data.id || `d3f${this.uid}`;
        this.model.inputs[data.name] = this.model;
        return data;
    }

}, formElement);


function getTheme(component) {
    var theme = component.formTheme;
    if (!theme && component.parent) return getTheme(component.parent);
    else return theme;
}

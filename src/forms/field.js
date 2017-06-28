import assign from 'object-assign';
import {select, selectAll} from 'd3-selection';

import warn from './warn';
import {modelData} from './utils';

//
// Mixin for all form elements
export const formElement = {

    // wrap the form element with extensions
    wrap (fieldEl) {
        var field = this,
            wrappedEl = fieldEl;

        this.model.$formExtensions.forEach((extension) => {
            wrappedEl = extension(field, wrappedEl, fieldEl) || wrappedEl;
        });

        return wrappedEl;
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
        value: null,
        error: '',
        isDirty: null,
        labelSrOnly: '',
        placeholder: '',
        showError: {
            reactOn: ['error', 'isDirty', 'formSubmitted'],
            get () {
                if (this.error) return this.isDirty || this.formSubmitted;
                return false;
            }
        },
        // default validate function does nothing, IMPORTANT!
        $validate () {}
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

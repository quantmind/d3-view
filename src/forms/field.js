import assign from 'object-assign';
import {isString} from 'd3-let';
import {select, selectAll} from 'd3-selection';

import warn from './warn';

//
// Mixin for all form elements
export const formElement = {

    inputData (el, data) {
        var model = this.model;
        if (!data) data = {};
        data.id = data.id || model.uid;
        model.data = data;
        el.attr('id', data.id);
        if (data.classes) el.classed(data.classes, true);

        if (data.disabled) {
            if (isString(data.disabled))
                el.attr('d3-attr-disabled', data.disabled);
            else
                el.property('disabled', true);
        }
        return data;
    },

    // wrap the form element with extensions
    wrap (fieldEl) {
        var field = this,
            wrappedEl = fieldEl;

        field.model.$formExtensions.forEach(extension => {
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
export default assign({}, formElement, {

    model: {
        value: null,
        error: '',
        isDirty: null,
        srOnly: false,
        placeholder: '',
        showError: {
            reactOn: ['error', 'isDirty'],
            get () {
                if (this.error) return this.isDirty;
                return false;
            }
        },
        // default validate function does nothing, IMPORTANT!
        $validate () {}
    },

    inputData (el, data) {
        data = formElement.inputData.call(this, el, data);
        if (!data.name)
            return warn ('Input field without a name');

        el.attr('name', name);
        data.placeholder = data.placeholder || data.label || data.name;
        var model = this.model;
        //
        // add this model to the form inputs object
        model.form.inputs[data.name] = model;
        // give name to model (for debugging info messages)
        model.name = data.name;
        model.$on('value', () => {
            // set isDirty to false if first time here, otherwise true
            model.isDirty === null ? model.isDirty = false : model.isDirty = true;
            // trigger a change event in the form
            // required for form method such as $isValid
            model.form.$change();
        });
        return data;
    }

});

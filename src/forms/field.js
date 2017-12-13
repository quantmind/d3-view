import {isString, isObject, assign} from 'd3-let';
import {select, selectAll} from 'd3-selection';
import {map} from 'd3-collection';


const properties = map({
    disabled: 'disabled',
    readonly: 'readOnly',
    required: 'required'
});

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
        addAttributes(el, model, data.attributes);
        properties.each((prop, key) => {
            var value = data[key];
            if (value) {
                if (isString(value))
                    el.attr(`d3-attr-${key}`, value);
                else
                    el.property(prop, true);
            }
        });
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
            this.logWarn('template does not provide a slot element');
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
        changed: false,
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
        // call parent method
        data = formElement.inputData.call(this, el, data);
        if (!data.name)
            return this.logError('Input field without a name');

        el.attr('name', data.name);
        data.placeholder = data.placeholder || data.label || data.name;
        var model = this.model;
        //
        // add this model to the form inputs object
        model.form.inputs[data.name] = model;
        //
        // give name to model (for debugging info messages)
        model.name = data.name;
        //
        // bind to the value property (two-way binding when used with d3-value)
        model.$on('value', () => {
            // set isDirty to false if first time here, otherwise true
            if (model.isDirty === null) {
                model.isDirty = false;
            } else {
                model.isDirty = true;
                model.changed = true;
            }
            // trigger a change event in the form
            // required for form method such as $isValid
            model.form.$change();
            model.$emit('formFieldChange', model);
        });
        return data;
    }

});


function addAttributes(el, model, attributes) {
    var expr, attr;

    if (!isObject(attributes)) return;

    for (attr in attributes) {
        expr = attributes[attr];
        if (isObject(expr)) expr = JSON.stringify(expr);
        el.attr(attr, expr || '');
    }
}

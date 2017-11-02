import {isArray} from 'd3-let';
import {map} from 'd3-collection';

import warn from '../utils/warn';

const properties = map({
    disabled: 'disabled',
    readonly: 'readOnly',
    required: 'required'
});

//
//  d3-attr-<attr> directive
//  ==============================
//
//  Create a one-way binding between a model and a HTML element attribute
//
export default {

    create (expression) {
        if (!this.arg) return warn('Cannot bind to empty attribute. Specify :<attr-name>');
        return expression;
    },

    refresh (model, value) {
        if (this.arg === 'class') return this.refreshClass(value);
        if (isArray(value)) return warn(`Cannot apply array to attribute ${this.arg}`);
        var prop = properties.get(this.arg);
        if (prop) this.sel.property(prop, value || false);
        else this.transition().attr(this.arg, value || null);
    },

    refreshClass (value) {
        var sel = this.sel;

        if (!isArray(value)) value = [value];

        if (this.oldValue)
            this.oldValue.forEach((entry) => {
                if (entry)
                    sel.classed(entry, false);
            });

        this.oldValue = value.map((entry) => {
            var exist = true;
            if (isArray(entry)) {
                exist = entry[1];
                entry = entry[0];
            }
            if (entry)
                sel.classed(entry, exist);
            return entry;
        });
    }

};

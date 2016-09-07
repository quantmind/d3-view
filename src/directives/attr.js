import {isArray} from 'd3-let';

import warn from '../utils/warn';

//
//  d3-attr:<attr> directive
//  ==============================
//
//  Create a one-way binding between a model and a HTML element attribute
export default {

    create: function (expression) {
        if (!this.arg) return warn('Cannot bind to empty attribute. Specify :<attr-name>');
        return expression;
    },

    refresh: function (model, value) {
        if (this.arg === 'class') return this.refreshClass(value);
        if (isArray(value)) return warn(`Cannot apply array to attribute ${this.arg}`);
        this.sel.attr(this.arg, value);
    },

    refreshClass: function (value) {
        var sel = this.sel;

        if (!isArray(value)) value = [value];

        if (this.oldValue)
            this.oldValue.forEach((entry) => {
                sel.classed(entry, false);
            });

        this.oldValue = value.map((entry) => {
            var exist = true;
            if (isArray(entry)) {
                exist = entry[1];
                entry = entry[0];
            }
            sel.classed(entry, exist);
            return entry;
        });
    }

};

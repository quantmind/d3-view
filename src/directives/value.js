import types from './types/index';

import warn from '../utils/warn';

//
//  d3-value directive
//  ===================
//
//  Two-way data binding for HTML elements supporting the value property
export default {

    create (expression) {
        var type = this.sel.attr('type'),
            tag = this.el.tagName.toLowerCase(),
            ValueType = types[type] || types[tag];

        if (!ValueType) return warn(`Cannot apply d3-value directive to ${tag}`);
        this.tag = new ValueType(this.el);
        return expression;
    },

    mount (model) {
        var expr = this.expression;
        // TODO: relax this constraint
        if (expr.parsed.type !== expr.codes.IDENTIFIER)
            return warn(`d3-value expression support identifiers only, got "${expr.parsed.type}": ${this.expression}`);
        var attrName = this.expression.expr;
        //
        // Create the model reactive attribute
        model.$set(attrName, this.tag.value());
        // register dom event
        this.tag.on(model, attrName);
        return model;
    },

    refresh (model, value) {
        this.tag.value(value);
    },

    destroy () {
        this.tag.off();
    }
};

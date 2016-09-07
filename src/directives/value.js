import tags from './tags';

import warn from '../utils/warn';

//
//  d3-value directive
//  ===================
//
//  Two-way data binding for HTML elements supporting the value property
export default {

    create: function (expression) {
        var type = this.sel.attr('type'),
            tag = this.el.tagName.toLowerCase(),
            Tag = tags[type] || tags[tag];

        if (!Tag) return warn(`Cannot apply d3-value directive to ${tag}`);
        this.tag = new Tag(this.el);
        return expression;
    },

    mount: function (model) {
        var expr = this.expression;
        // TODO: relax this constraint
        if (expr.parsed.type !== expr.codes.IDENTIFIER)
            return warn(`d3-model expression support identifiers only, got "${expr.parsed.type}": ${this.expression}`);
        var attrName = this.expression.expr;
        //
        // Create the model reactive attribute
        model.$set(attrName, this.tag.value);

        this.tag.on(model, attrName);
        return model;
    },

    refresh: function (model, value) {
        this.tag.value = value;
    },

    destroy: function () {
        this.tag.off();
    }
};



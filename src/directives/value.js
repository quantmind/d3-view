import types from "./types/index";

//
//  d3-value directive
//  ===================
//
//  Two-way data binding for HTML elements supporting the value property
export default {
  create(expression) {
    var type = this.sel.attr("type"),
      tag = this.el.tagName.toLowerCase(),
      ValueType = types[type] || types[tag];

    if (!ValueType) {
      this.logWarn(`Cannot apply d3-value directive to ${tag}`);
      return;
    }
    this.tag = new ValueType(this.el);
    return expression;
  },

  mount(model) {
    var expr = this.expression;
    // TODO: relax this constraint
    if (expr.parsed.type !== expr.codes.IDENTIFIER) {
      this.logWarn(
        `support identifiers only, got "${expr.parsed.type}": ${
          this.expression
        }`
      );
      return;
    }
    var attrName = this.expression.expr;
    //
    // Create the model reactive attribute
    model.$set(attrName, this.tag.value());
    // register dom event
    this.tag.on(model, attrName);
    return model;
  },

  refresh(model, value) {
    this.tag.value(value);
  },

  destroy(model) {
    this.tag.off(model);
  }
};

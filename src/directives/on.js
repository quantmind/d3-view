//
//  d3-on directive
//
//  A one-way data binding from dom events to model properties/methods
//  Event listeners are on the DOM, not on the model
export default {
  mount(model) {
    var eventName = this.arg || "click",
      expr = this.expression;

    // DOM event => model binding
    this.on(this.sel, `${eventName}.${this.uid}`, event => {
      var md = model.$child();
      md.$event = event;
      expr.eval(md);
    });

    this.bindDestroy(model);
    // Does not return the model so that model data binding is not performed
  },

  destroy() {
    var eventName = this.arg || "click";
    this.on(this.sel, `${eventName}.${this.uid}`, null);
  }
};

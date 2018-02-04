//
//  d3-prop-<attr> directive
//  ==============================
//
//  Create a onece-only binding between a model and an HTML data-<prop> element attribute
//
export default {
    create (expression) {
        if (!this.arg) return this.logWarn('Cannot bind to empty attribute. Specify :<attr-name>');
        return expression;
    },

    once (model, data) {
        data[this.arg] = this.expression.safeEval(model);
    }

};

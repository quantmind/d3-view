import warn from '../utils/warn';
//
//  d3-model directive
//  ===================
//
//  Create a new model on the element based on data from parent models
//  This is a special directive and the first to be mounted
export default {

    mount: function (model) {
        var expr = this.expression;
        if (expr.parsed.type !== expr.codes.IDENTIFIER)
            return warn(`d3-model expression support identifiers only, got "${expr.parsed.type}": ${this.expression}`);
        var newModel = model.$child(expr.eval(model));
        this.sel.model(newModel);
        model.$setbase(this.expression.expr, newModel);
    }

};

//
//  d3-on directive
export default {

    mount: function (model) {
        var event = this.arg || 'click',
            expr = this.expression;

        // DOM event => model binding
        this.sel.on(`${event}.${this.uid}`, () => {
            expr.eval(model);
        });
    }
};

//
//  d3-on directive
export default {

    mount (model) {
        var eventName = this.arg || 'click',
            expr = this.expression;

        // DOM event => model binding
        this.on(this.sel, `${eventName}.${this.uid}`, (event) => {
            model.$event = event;
            try {
                expr.eval(model);
            } finally {
                delete model.$event;
            }
        });
    },

    destroy () {
        var eventName = this.arg || 'click';
        this.on(this.sel, `${eventName}.${this.uid}`, null);
    }
};

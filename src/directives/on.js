//
//  d3-on directive
export default {

    mount (model) {
        var eventName = this.arg || 'click',
            expr = this.expression;

        // DOM event => model binding
        this.on(this.sel, `${eventName}.${this.uid}`, (event) => {
            expr.eval(model.$child({$event: event}));
        });

        return model;
    },

    destroy () {
        var eventName = this.arg || 'click';
        this.on(this.sel, `${eventName}.${this.uid}`, null);
    }
};

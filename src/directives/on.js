import {event} from 'd3-selection';

//
//  d3-on directive
export default {

    mount: function (model) {
        var eventName = this.arg || 'click',
            expr = this.expression;

        // DOM event => model binding
        this.sel.on(`${eventName}.${this.uid}`, () => {
            model.$event = event;
            try {
                expr.eval(model);
            } finally {
                delete model.$event;
            }
        });
    }
};

import {select} from 'd3-selection';
import {isArray} from 'd3-let';
import Directive from '../directive';
import {expression} from '../parser';


//
//  d3-attr:<attr> directive
//  ===================
//
//  Create a one-way binding between a model and a HTML element attribute
export default class extends Directive {

    mount (model) {
        var attr = this.extra,
            expr = expression(this.expression),
            dir = this;

        if (!expr) return;
        if (!attr) return this.warn('Cannot bind to empty attribute. Specify :<attr-name>');

        var identifiers = expr.identifiers();

        // One way bindings
        identifiers.forEach((name) => {
            model.$on(`${name}.${dir.uid}`, refresh);
        });

        refresh();

        function refresh() {
            var value = expr.eval(model),
                el = select(dir.el);

            if (isArray(value)) {
                if (dir.extra === 'class') value.forEach((entry) => {
                    var exist = true;
                    if (isArray(entry)) {
                        exist = entry[1];
                        entry = entry[0];
                    }
                    el.classed(entry, exist);
                });
                else dir.warn(`Cannot apply array to attribute ${dir.extra}`);
            } else
                el.attr(dir.extra, value);
        }
    }
}

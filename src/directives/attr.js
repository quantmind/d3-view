import {isArray} from 'd3-let';
import Directive from '../directive';


//
//  d3-attr:<attr> directive
//  ==============================
//
//  Create a one-way binding between a model and a HTML element attribute
export default class extends Directive {

    create (expression) {
        if (!this.args) return this.warn('Cannot bind to empty attribute. Specify :<attr-name>');
        return expression;
    }

    refresh (model, value) {
        var sel = this.sel;

        if (isArray(value)) {
            if (this.arg === 'class') value.forEach((entry) => {
                var exist = true;
                if (isArray(entry)) {
                    exist = entry[1];
                    entry = entry[0];
                }
                sel.classed(entry, exist);
            });
            else this.warn(`Cannot apply array to attribute ${this.arg}`);
        } else
            sel.attr(this.arg, value);
    }
}

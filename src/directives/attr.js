import {isArray} from 'd3-let';
import Directive from '../directive';


//
//  d3-attr:<attr> directive
//  ==============================
//
//  Create a one-way binding between a model and a HTML element attribute
export default class extends Directive {

    create (expression) {
        if (!this.arg) return this.warn('Cannot bind to empty attribute. Specify :<attr-name>');
        return expression;
    }

    refresh (model, value) {
        if (this.arg === 'class') this.refreshClass(value);
        if (isArray(value)) return this.warn(`Cannot apply array to attribute ${this.arg}`);
        this.sel.attr(this.arg, value);
    }

    refreshClass (value) {
        var sel = this.sel;

        if (!isArray(value)) value = [value];

        if (this.oldValue)
            this.oldValue.forEach((entry) => {
                sel.classed(entry, false);
            });

        this.oldValue = value.map((entry) => {
            var exist = true;
            if (isArray(entry)) {
                exist = entry[1];
                entry = entry[0];
            }
            sel.classed(entry, exist);
            return entry;
        });
    }

}

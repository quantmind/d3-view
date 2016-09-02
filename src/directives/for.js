import {select} from 'd3-selection';
import Directive from '../directive';

//
// for loop
export default class extends Directive {

    get priority () {
        return 2000;
    }

    mount (model) {
        var dir = this,
            bits = [];

        this.expression.trim().split(' ').forEach((v) => {
            v ? bits.push(v) : null;
        });

        if (bits.length !== 3 || bits[1] != 'in') return this.vm.warn('d3-for directive requires "item in data" template');

        this.creator = this.el;
        this.itemName = bits[0];
        this.attrName = bits[2];
        // set parent node as this element
        this.el = this.el.parentNode;
        // remove the creator from the DOM
        select(this.creator).remove();

        // model => DOM binding
        model.$on(this.attrName, refresh);

        function refresh () {
            var value = model.$get(dir.attrName);

            if (!value) return;

            var creator = dir.creator,
                itemName = dir.itemName,
                items = select(dir.el).selectAll(creator.tagName).data(value),
                enter = items.enter().append(() => {
                    return creator.cloneNode(true);
                }).each(function (d, index) {
                    var x = {index: index};
                    x[itemName] = d;
                    model.$child(x).$mount(this);
                });
            enter.merge(items);
        }
    }
}

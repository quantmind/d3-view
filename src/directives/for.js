import {select} from 'd3-selection';
import Directive from '../directive';

//
// for loop
export default class extends Directive {

    mount (item_in_data) {
        var dir = this,
            model = this.model,
            bits = [];

        if (!this.el.parentNode) return this.vm.warn('d3-for requires a parent node');
        item_in_data.trim().split(' ').forEach((v) => {v ? bits.push(v) : null;});

        if (bits.length !== 3 || bits[1] != 'in') return this.vm.warn('d3-for directive requires "item in data" template');

        this.stamp = this.el;
        this.attrName = bits[0];
        this.dataName = bits[2];
        this.el = this.el.parentNode;
        this.stamp.remove();

        // model => DOM binding
        model.$on(this.dataName, function (value) {
            dir.expand(value);
        });

        this.expand(model.$get(this.dataName));
    }

    expand (value) {
        if (!value) return;
        var model = this.model,
            vm = model.$vm,
            stamp = this.stamp,
            attrName = this.attrName,
            items = select(this.el).selectAll(this.stamp.tagName).data(value),
            enter = items.enter().append(() => {
                return stamp.cloneNode(true);
            }).each(function (d, index) {
                var x = {index: index};
                x[attrName] = d;
                vm.mountElement(this, model.$child(x));
            });
        enter.merge(items);
    }
}

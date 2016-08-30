import {select} from 'd3-selection';
import Directive from '../directive';

//
// for loop
export default class extends Directive {

    get priority () {
        return 2000;
    }

    create () {
        var dir = this,
            model = this.model,
            bits = [];

        if (!this.el.parentNode) return this.vm.warn('d3-for requires a parent node');
        this.expression.trim().split(' ').forEach((v) => {v ? bits.push(v) : null;});

        if (bits.length !== 3 || bits[1] != 'in') return this.vm.warn('d3-for directive requires "item in data" template');

        this.creator = this.el;
        this.itemName = bits[0];
        this.attrName = bits[2];
        this.el = this.el.parentNode;
        // remove the creator from the DOM
        select(this.creator).remove();

        // model => DOM binding
        model.$on(this.attrName, function () {
            dir.mount();
        });
    }

    mount () {
        var model = this.model,
            value = model.$get(this.attrName);

        if (!value) return;

        var vm = model.$vm,
            creator = this.creator,
            itemName = this.itemName,
            items = select(this.el).selectAll(creator.tagName).data(value),
            enter = items.enter().append(() => {
                return creator.cloneNode(true);
            }).each(function (d, index) {
                var x = {index: index};
                x[itemName] = d;
                vm.mountElement(this, model.$child(x, this));
            });
        enter.merge(items);
    }
}

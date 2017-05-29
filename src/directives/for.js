import {select} from 'd3-selection';
import {isArray} from 'd3-let';

import simpleView from '../core/view';
import warn from '../utils/warn';

//
//  d3-for directive
//  ======================
//
//  Repeat a element over an array of items and establish
//  a one way binding between the array and the Dom
export default {

    create (expression) {
        var bits = [];
        expression.trim().split(' ').forEach((v) => {
            v ? bits.push(v) : null;
        });
        if (bits.length !== 3 || bits[1] != 'in')
            return warn(`d3-for directive requires "item in expression" template, got "${expression}"`);
        this.itemName = bits[0];
        this.itemClass = `for${this.uid}`;
        return bits[2];
    },

    preMount () {
        return true;
    },

    mount (model) {
        this.creator = this.el;
        this.el = this.creator.parentNode;
        // remove the creator from the DOM
        select(this.creator).remove();
        if (this.el) return model;
    },

    refresh (model, items) {
        if (!isArray(items)) return;

        var creator = this.creator,
            selector = `${creator.tagName}.${this.itemClass}`,
            itemName = this.itemName,
            sel = this.sel,
            entries = sel.selectAll(selector).data(items),
            vm = sel.view();

        let x;

        entries.exit().remove();

        entries
            .enter()
                .append(() => {
                    return creator.cloneNode(true);
                })
                .classed(this.itemClass, true)
                .each(function (d, index) {
                    x = {index: index};
                    x[itemName] = d;
                    simpleView({
                        model: x,
                        parent: vm
                    }).mount(this);
                });
            //.merge(entries)
            //    .each(function () {
            //        var vm = this.__d3_view__;
            //        if (vm._refresh) vm.refresh();
            //        vm._refresh = true;
            //    });
    }
};

import {select} from 'd3-selection';
import {isArray} from 'd3-let';

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
        return model;
    },

    refresh (model, items) {
        if (!isArray(items)) return;

        var creator = this.creator,
            selector = `${creator.tagName}.${this.itemClass}`,
            itemName = this.itemName,
            entries = this.sel.selectAll(selector).data(items);
        let x;

        entries
            .enter()
            .append(() => {
                return creator.cloneNode(true);
            })
            .classed(this.itemClass, true)
            .each(function (d, index) {
                x = {index: index};
                x[itemName] = d;
                select(this).model(model.$child(x)).mount();
            });

        entries.exit().remove();
    }
};

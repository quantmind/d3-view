import { isArray } from "d3-let";
import { select } from "d3-selection";
import { createComponent, protoView } from "../core/component";

//
//  d3-for directive
//  ======================
//
//  Repeat a element over an array of items and establish
//  a one way binding between the array and the Dom
export default {
  create(expression) {
    var bits = [];
    expression
      .trim()
      .split(" ")
      .forEach(v => {
        v ? bits.push(v) : null;
      });
    if (bits.length !== 3 || bits[1] != "in")
      return this.logWarn(
        `directive requires "item in expression" template, got "${expression}"`
      );
    this.itemName = bits[0];
    this.itemClass = `for${this.uid}`;
    return bits[2];
  },

  preMount() {
    return true;
  },

  mount(model) {
    this.creator = this.el;
    this.el = this.creator.parentNode;
    // remove the creator from the DOM
    select(this.creator).remove();
    if (this.el) return model;
  },

  refresh(model, items) {
    if (!isArray(items)) return;
    let d;

    var creator = this.creator,
      itemClass = this.itemClass,
      selector = `.${itemClass}`,
      itemName = this.itemName,
      sel = this.sel,
      allItems = sel.selectAll(selector),
      entries = allItems
        .filter(function() {
          d = this.__d3_view__.model[itemName];
          return items.indexOf(d) > -1;
        })
        .data(items),
      exits = allItems
        .filter(function() {
          d = this.__d3_view__.model[itemName];
          return items.indexOf(d) === -1;
        })
        .classed(itemClass, false),
      vm = sel.view();

    let forComponent = vm.components.get(creator.tagName.toLowerCase());
    if (!forComponent) forComponent = createComponent("forView", protoView);

    let x, el, fel, tr;

    (this.transition(exits) || exits).style("opacity", 0).remove();

    // Add all missing entries
    entries
      .enter()
      .append(() => {
        el = creator.cloneNode(true);
        fel = vm.select(el);
        if (vm.transitionDuration(fel) > 0) fel.style("opacity", 0);
        return el;
      })
      .each(function(d, index) {
        x = { index: index };
        x[itemName] = d;
        forComponent({
          model: x,
          parent: vm
        })
          .mount(this, { model: vm.model })
          .then(fv => {
            fv.sel.classed(itemClass, true);
            // replace the item with a property from the model
            // This allow for reactivity when d is an object
            items[index] = fv.model[itemName];
            tr = fv.transition();
            if (tr) tr.style("opacity", 1);
          });
      });

    sel.selectAll(selector).each(function(d) {
      // update model itemName property
      this.__d3_view__.model[itemName] = d;
    });
  }
};

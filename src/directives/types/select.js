import { isArray } from "d3-let";
import { select } from "d3-selection";
import { createValueType } from "./type";

export default createValueType({
  value(value) {
    var sel = this.sel,
      options = sel.selectAll("option"),
      values = value,
      opt;

    if (arguments.length) {
      if (!isArray(values)) values = [value || ""];
      options.each(function() {
        opt = select(this);
        value = opt.attr("value") || "";
        opt.property("selected", values.indexOf(value) > -1);
      });
    } else {
      values = [];
      options.each(function() {
        opt = select(this);
        if (opt.property("selected")) values.push(opt.attr("value") || "");
      });
      if (sel.property("multiple")) return values;
      else return values[0] || "";
    }
  }
});

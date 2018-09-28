import { createValueType } from "./type";

export default createValueType({
  value(value) {
    if (arguments.length) this.sel.property("checked", value);
    else return this.sel.property("checked");
  }
});

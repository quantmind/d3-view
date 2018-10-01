import { assign } from "d3-let";
import field from "./field";
import validators from "./validate";

const checks = ["checkbox", "radio"];

//
// Input element
export default assign({}, field, {
  render() {
    const el = this.init(this.createElement("input", true));

    el.attr("type", this.props.type || "text").attr("d3-value", "value");

    if (checks.indexOf(el.attr("type")) === -1 && this.props.placeholder)
      el.attr("placeholder", this.props.placeholder);

    validators(this, el);
    return this.wrap(el);
  }
});

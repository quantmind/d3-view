import { assign } from "d3-let";
import field from "./field";
import validators from "./validate";

//
// Textarea element
export default assign({}, field, {
  render() {
    var el = this.init(this.createElement("textarea", true));
    el.attr("placeholder", this.props.placeholder).attr("d3-value", "value");

    validators(this, el);
    return this.wrap(el);
  }
});

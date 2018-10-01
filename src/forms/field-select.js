import { assign, isArray, isString } from "d3-let";
import field from "./field";
import validators from "./validate";

//
// Select element
export default assign({}, field, {
  model: assign(
    {
      options: []
    },
    field.model
  ),

  render() {
    const el = this.init(this.createElement("select", true));
    this.model.options = asOptions(this.model.options);
    el.attr("d3-value", "value")
      .attr("placeholder", this.props.placeholder)
      .append("option")
      .attr("d3-for", "option in options")
      .attr("d3-html", "option.label")
      .attr("d3-attr-value", "option.value");

    validators(this, el);
    return this.wrap(el);
  }
});

const asOptions = options => {
  if (!isArray(options)) options = [];
  options.forEach((opt, idx) => {
    if (isArray(opt))
      opt = {
        value: opt[0],
        label: opt[1] || opt[0]
      };
    else if (isString(opt))
      opt = {
        value: opt,
        label: opt
      };
    options[idx] = opt;
  });
  return options;
};

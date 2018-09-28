import { assign } from "d3-let";
import { formElement } from "./field";

//
// Submit element
export default assign({}, formElement, {
  model: {
    $submit() {
      if (this.$event && this.$event.defaultPrevented) return;
      this.props.form.actions.submit.call(this, this.$event);
    }
  },

  render() {
    const tag = this.props.tag || "button",
      el = this.init(this.createElement(tag, true));

    el.attr("type", this.props.type || "submit")
      .attr("name", this.props.name || "_submit_")
      .attr("d3-on-click", "$submit()")
      .html(this.props.label || "submit");

    return this.wrap(el);
  }
});

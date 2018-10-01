import { assign, isArray, isString } from "d3-let";
import properties from "../utils/htmlprops";
import { addAttributes, formChild } from "./utils";

//
// Mixin for all form elements
export const formElement = {
  props: ["form"],

  addChildren(sel, form) {
    var children = this.props.children;
    if (children) {
      if (!isArray(children)) {
        this.logError(
          `children should be an array of fields, got ${typeof children}`
        );
        return sel;
      }
      if (form)
        children.forEach(c => {
          c.form = form;
        });
      sel
        .selectAll(".d3form")
        .data(children)
        .enter()
        .append(formChild)
        .attr("form", "form")
        .classed("d3form", true);
    }
    return sel;
  },

  init(el) {
    addAttributes(el, this.props.attributes);
    properties.forEach((prop, key) => {
      var value = this.props[key];
      if (value) {
        if (isString(value)) el.attr(`d3-attr-${key}`, value);
        else el.property(prop, true);
      }
    });
    return el;
  },

  // wrap the form element with extensions
  wrap(fieldEl) {
    var wrappedEl = fieldEl;

    this.root.$formExtensions.forEach(extension => {
      wrappedEl = extension(this, wrappedEl, fieldEl) || wrappedEl;
    });

    return wrappedEl;
  },

  wrapTemplate(sel, template) {
    var outer = this.createElement("div").html(template),
      slot = outer.select("slot");

    if (!slot.size()) {
      this.logWarn("template does not provide a slot element");
      return sel;
    }
    var target = this.select(slot.node().parentNode);
    sel.nodes().forEach(function(node) {
      target.insert(() => {
        return node;
      }, "slot");
    });
    slot.remove();
    return this.selectAll(outer.node().children);
  }
};

// A mixin for all form field components
export default assign({}, formElement, {
  model: {
    value: null,
    error: "",
    isDirty: null,
    changed: false,
    srOnly: false,
    placeholder: "",
    showError: {
      reactOn: ["error", "isDirty"],
      get() {
        if (this.error) return this.isDirty;
        return false;
      }
    },
    // default validate function does nothing, IMPORTANT!
    $validate() {}
  },

  init(el) {
    // call parent method
    formElement.init.call(this, el);
    const props = this.props,
      model = this.model;

    if (!props.name) {
      this.logError("Input field without a name");
      return el;
    }

    el.attr("name", props.name);
    if (!props.placeholder) props.placeholder = props.label || props.name;
    //
    // give name to model (for debugging info messages)
    model.name = props.name;
    //
    // bind to the value property (two-way binding when used with d3-value)
    model.$on("value", () => {
      // set isDirty to false if first time here, otherwise true
      if (model.isDirty === null) {
        model.isDirty = false;
      } else {
        model.isDirty = true;
        model.changed = true;
      }
      // trigger a change event in the form
      // required for form method such as $isValid
      props.form.$change();
      model.$emit("formFieldChange", model);
    });
    return el;
  },

  mounted() {
    // add this model to the form inputs object
    this.props.form.inputs[this.props.name] = this.model;
  }
});

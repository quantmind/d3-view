import formCheck from "./check";
import error from "./error";
import formGroup from "./form-group";
import help from "./help";
import inputGroup from "./input-group";
import label from "./label";
import submit from "./submit";

const bootstrap = {
  input: ["error", "inputGroup", "label", "help", "formGroup"],
  checkbox: ["error", "formCheck", "help", "formGroup"],
  textarea: ["error", "label", "help", "formGroup"],
  select: ["error", "label", "help", "formGroup"],
  submit: ["submit"],
  wrappers: {
    error,
    label,
    formGroup,
    inputGroup,
    formCheck,
    submit,
    help
  }
};

//
//  Bootstrap plugin
//  ===================
//
//  Simply add a new form extension to wrap form fields
//
export default {
  install(vm) {
    if (!vm.$formExtensions)
      return vm.logWarn(
        "form bootstrap requires the form plugin installed first!"
      );
    vm.$formExtensions.push(wrapBootstrap);
  }
};

function wrapBootstrap(field, wrappedEl, fieldEl) {
  var wrappers =
    bootstrap[fieldEl.attr("type")] ||
    bootstrap[fieldEl.node().tagName.toLowerCase()];
  if (!wrappers) return wrappedEl;
  let wrap;

  wrappers.forEach(wrapper => {
    wrap = bootstrap.wrappers[wrapper];
    if (wrap) wrappedEl = wrap(field, wrappedEl, fieldEl);
    else field.logWarn(`Could not find form field wrapper ${wrapper}`);
  });

  return wrappedEl;
}

import validators from "./validators";

// validator singleton
export default (vm, el) => {
  validators.forEach(validator => {
    if (validator.set) validator.set(el, vm.props);
  });
  vm.model.$on("value.validate", validate);
  vm.model.$validate = validate;
};

function validate() {
  var vm = this.$$view,
    value = this.value,
    el =
      vm.sel.attr("id") === this.props.id
        ? vm.sel
        : vm.sel.select(`#${this.props.id}`),
    msg;

  for (let validator of validators.values()) {
    msg = validator.validate(el, value);
    if (msg) {
      if (msg === true) msg = "";
      break;
    }
  }

  this.error = msg || "";
}

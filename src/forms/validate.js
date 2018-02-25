
import validators from './validators';


// validator singleton
export default (vm, el) => {
    validators.forEach(validator => validator.set(el, vm.props));
    vm.model.$on('value.validate', validate);
    vm.model.$validate = validate;
};


function validate () {
    var vm = this.$$view,
        value = this.value,
        el = vm.sel.attr('id') === this.props.id ? vm.sel : vm.sel.select(`#${this.props.id}`),
        validator,
        msg;

    for (var i=0; i<validators.length; ++i) {
        validator = validators[i];
        msg = validator.validate(el, value);
        if (msg) {
            if (msg === true) msg = '';
            break;
        }
    }

    this.error = msg || '';
}

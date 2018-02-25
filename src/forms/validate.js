
import validators from './validators';


// validator singleton
export default (vm, el) => {
    validators.forEach(validator => validator.set(el, vm.props));
    vm.model.$on('value.validate', validate);
    vm.model.$validate = validate;
};


function validate () {
    var model = this,
        vm = model.$$view,
        value = model.value,
        el = vm.sel.attr('id') === model.data.id ? vm.sel : vm.sel.select(`#${model.data.id}`),
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

    model.error = msg || '';
}

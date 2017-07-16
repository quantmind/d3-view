import {isString, isObject} from 'd3-let';


const required = {

    set (el, data) {
        var value = data.required;
        if (isString(value))
            el.attr(`d3-required`, value);
        else
            el.property('required', value || null);
    },

    validate (el, value) {
        if (el.property('required'))
            if (!value) return 'required';
        else if (value === '') {
            // this is valid, no need to continue with the remaining validators
            return true;
        }
    }
};


const minLength = {

    set (el, data) {
        var value = data.minLength;
        if (isString(value))
            el.attr(`d3-attr-minlength`, value);
        else if (value !== undefined)
            el.attr('minlength', value);
    },

    validate (el, value) {
        var l = +el.attr('minlength');
        if (l === l && l > 0 && value.length < l)
            return `too short - ${l} characters or more expected`;
    }
};


const maxLength = {

    set (el, data) {
        var value = data.maxLength;
        if (isString(value))
            el.attr(`d3-attr-maxlength`, value);
        else if (value !== undefined)
            el.attr('maxlength', value);
    },

    validate (el, value) {
        var l = +el.attr('maxlength');
        if (l === l && l > 0 && value && value.length > l)
            return `too long - ${l} characters or less expected`;
    }
};


const minimum = {

    set (el, data) {
        var value = data.minimum;
        if (isString(value))
            el.attr(`d3-attr-min`, value);
        else if (value !== undefined)
            el.attr('min', value);
    },

    validate (el, value) {
        var r = range(el);
        if (r && +value < r[0])
            return `must be greater or equal ${r[0]}`;
    }
};


const maximum = {

    set (el, data) {
        var value = data.maximum;
        if (isString(value))
            el.attr(`d3-attr-max`, value);
        else if (value !== undefined)
            el.attr('max', value);
    },

    validate (el, value) {
        var r = range(el);
        if (r && +value > r[1])
            return `must be less or equal ${r[1]}`;
    }
};

// validator singleton
export default {

    // get the list of validators
    // custom is an optional list of custom validators
    get (custom) {
        var validators = this.all.slice(0);
        if (isObject(custom))
            for (var key in custom)
                validators.push(customValidator(key, custom[key]));
        return validators;
    },

    // add model validators to a form-field
    set (vm, el) {
        var model = vm.model;
        model._view = vm;
        model.validators.forEach((validator) => validator.set(el, vm.data));
        model.$on('value.validate', this.validate);
        model.$validate = this.validate;
    },

    validate () {
        var model = this,
            vm = model._view,
            validators = model.validators,
            value = model.value,
            el = vm.sel.attr('id') === vm.data.id ? vm.sel : vm.sel.select(`#${vm.data.id}`),
            validator,
            msg;

        model.isDirty === null ? model.isDirty = false : model.isDirty = true;

        for (var i=0; i<validators.length; ++i) {
            validator = validators[i];
            msg = validator.validate(el, value);
            if (msg) {
                if (msg === true) msg = '';
                break;
            }
        }

        model.error = msg || '';
    },

    all: [
        required,
        minLength,
        maxLength,
        minimum,
        maximum
    ]
};


function range (el) {
    var l0 = el.attr('min'),
        l1 = el.attr('max');
    l0 = l0 === null ? -Infinity : +l0;
    l1 = l1 === null ? Infinity : +l1;
    return [l0, l1];
}


function customValidator (key, method) {

    return {
        set (el, data) {
            var value = data[key];
            if (!value) return;
        },

        validate (el, value) {
            return method(el, value);
        }
    };
}

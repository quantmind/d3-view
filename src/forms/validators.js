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
        if (el.property('required')) {
            if (!value) return 'required';
        }
        else if (value === '')
            return true;
    }
};


const minlength = {

    set (el, data) {
        var value = data.minlength;
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


const maxlength = {

    set (el, data) {
        var value = data.maxlength;
        if (isString(value))
            el.attr(`d3-attr-maxlength`, value);
        else if (value !== undefined)
            el.attr('maxlength', value);
    },

    validate (el, value) {
        var l = +el.attr('maxlength');
        if (l === l && l > 0 && value.length > l)
            return `too long - ${l} characters or less expected`;
    }
};


const min = {

    set (el, data) {
        var value = data.min;
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


const max = {

    set (el, data) {
        var value = data.max;
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


export default {

    get (model, custom) {
        var validators = this.all.slice(0);
        if (isObject(custom))
            for (var key in custom)
                validators.push(customValidator(key, custom[key]));
        return validators;
    },

    set (vm, el) {
        vm.model.validators.forEach((validator) => {
            validator.set(el, vm.data);
        });

        vm.model.$on((property) => this.validate(property, vm));
    },

    validate (property, vm) {
        if (property !== 'value') return;

        var model = vm.model,
            validators = model.validators,
            value = model.value,
            el = vm.sel.attr('id') === vm.data.id ? vm.sel : vm.sel.select(`#${vm.data.id}`),
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
    },

    all: [
        required,
        minlength,
        maxlength,
        min,
        max
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

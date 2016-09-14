import {isString} from 'd3-let';


const required = {

    set (el, value) {
        if (isString(value))
            el.attr(`d3-required`, value);
        else
            el.property('required', value || null);
    },

    validate (el, value) {
        if (el.property('required') && !value)
            return 'required';
    }
};


const minlength = {

    set (el, value) {
        if (isString(value))
            el.attr(`d3-attr-minlength`, value);
        else if (value)
            el.attr('minlength', value);
    },

    validate (el, value) {
        var l = +el.attr('minlength');
        if (l === l && l > 0 && value.length < l)
            return `too short - ${l} characters or more expected`;
    }
};


const maxlength = {

    set (el, value) {
        if (isString(value))
            el.attr(`d3-attr-maxlength`, value);
        else if (value)
            el.attr('maxlength', value);
    },

    validate (el, value) {
        var l = +el.attr('maxlength');
        if (l === l && l > 0 && value.length < l)
            return `too long - ${l} characters or less expected`;
    }
};


const min = {

    set (el, value) {
        if (isString(value))
            el.attr(`d3-attr-min`, value);
        else if (value)
            el.attr('min', value);
    },

    validate (el, value) {
        var l = +el.attr('min');
        if (l === l && +value < l)
            return `must be greater or equal ${l}`;
    }
};


const max = {

    set (el, value) {
        if (isString(value))
            el.attr(`d3-attr-max`, value);
        else if (value)
            el.attr('max', value);
    },

    validate (el, value) {
        var l = +el.attr('max');
        if (l === l && +value > l)
            return `must be less or equal ${l}`;
    }
};


export default {

    set (vm, el) {
        for (var key in this.all)
            this.all[key].set(el, vm.data[key]);

        vm.validators = this;
        vm.model.$on(this.validate);
    },

    validate (property) {
        if (property !== 'value') return;

        var vm = this.$vm,
            validators = vm.validators.all,
            el = vm.sel.attr('id') === vm.data.id ? vm.sel : vm.sel.select(`#${vm.data.id}`),
            value = this.value,
            msg;

        for (var key in validators) {
            msg = validators[key].validate(el, value);
            if (msg) break;
        }
        this.error = msg || '';
    },

    all: {
        required,
        minlength,
        maxlength,
        min,
        max
    }
};

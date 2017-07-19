import assign from 'object-assign';

import debounce from '../../utils/debounce';
import sel from '../../utils/sel';


const base = {

    on (model, attrName) {
        var refresh = refreshFunction(this, model, attrName);

        // DOM => model binding
        this.sel
            .on('input', refresh)
            .on('change', refresh);
    },

    off () {
        this.sel
            .on('input', null)
            .on('change', null);
    },

    value (value) {
        if (arguments.length)
            this.sel.property('value', value);
        else
            return this.sel.property('value');
    }
};


export function createValueType (proto) {

    function ValueType(el) {
        sel(this).el = el;
    }

    ValueType.prototype = assign({}, base, proto);

    return ValueType;
}


export function refreshFunction (vType, model, attrName) {

    return debounce(() => {
        model.$set(attrName, vType.value());
    });
}

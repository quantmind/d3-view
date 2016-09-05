import {select} from 'd3-selection';
import {debounce} from '../../utils';

export default class {

    constructor (el) {
        this.el = el;
    }

    on (model, attrName) {
        // DOM => model binding
        select(this.el).on('change', refreshFunction(this, model, attrName));
    }

    get value () {
        return select(this.el).property('value');
    }

    set value (v) {
        select(this.el).property('value', v);
    }
}


export function refreshFunction (dom, model, attrName) {

    return debounce(() => {
        model.$set(attrName, dom.value);
    });
}

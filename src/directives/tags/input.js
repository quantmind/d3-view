import {select} from 'd3-selection';


export default class {

    constructor (el) {
        this.el = el;
    }

    on (model, attrName) {
        var self = this;
        
        // DOM => model binding
        select(this.el).on('change', function () {
            model.$set(attrName, self.value);
        });
    }

    get value () {
        return select(this.el).property('value');
    }

    set value (v) {
        select(this.el).property('value', v);
    }
}

import {select} from 'd3-selection';


export class Tag {

    constructor (el, attrName, model) {
        this.el = el;
        this.attrName = attrName;
        this.model = model;
        var self = this;
        //
        // Create the model reactive attribute
        model.$set(attrName, this.value);

        // model => DOM binding
        model.$on(attrName, function (value) {
            self.value = value;
        });
        this._dom_bind();
    }

    get value () {
        return select(this.el).property('value');
    }
    
    set value (v) {
        select(this.el).property('value', v);
    }
}


export default class extends Tag {

    _dom_bind () {
        var self = this;

        // DOM => model binding
        select(this.el).on('change', function () {
            self.model.$set(self.attrName, self.value);
        });
    }
}

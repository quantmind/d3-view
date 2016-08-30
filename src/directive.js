import {map} from 'd3-collection';


export default class {

    constructor (model, el, attr) {
        this.model = model;
        this.el = el;
        var directives = el._d3_directives;
        if (!directives) {
            directives = map();
            el._d3_directives = directives;
        }
        directives.set(attr.name, this);
        this.el.removeAttribute(attr.name);
        this.mount(attr.value);
    }

    mount () {}

    get vm () {
        return this.model.$vm;
    }

    warn (msg) {
        this.vm.warn(msg);
    }

    destroy () {}
}

import {map} from 'd3-collection';


export default class {

    constructor (vm, el, attr) {
        this.vm = vm;
        this.el = el;
        var directives = el._d3_directives;
        if (!directives) {
            directives = map();
            el._d3_directives = directives;
        }
        directives.set(attr.name, this);
        this.mount(attr.value);
        this.el.removeAttribute(attr.name);
    }

    mount () {}

    get model () {
        return this.vm.model;
    }

    warn (msg) {
        this.vm.warn(msg);
    }

    destroy () {}
}

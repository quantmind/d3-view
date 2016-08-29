

export default class {

    constructor (vm, el, attr) {
        this.vm = vm;
        this.el = el;
        this.model.$directives.set(attr.name, this);
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

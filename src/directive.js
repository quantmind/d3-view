//
// Directive base class
//
// Directives are special attributes with the d3- prefix.
// Directive attribute values are expected to be binding expressions.
// A directive’s job is to reactively apply special behavior to the DOM
// when the value of its expression changes.
//
// A directive can implement one or more of the directive methods:
//
//  * init
//  * create
//  * mount
//  * destroy
//
export default class {

    constructor (model, el, attr) {
        this.init();
        this.model = model;
        this.el = el;
        this.el.removeAttribute(attr.name);
        this.expression = attr.value;
        this.create();
    }

    get vm () {
        return this.model.$vm;
    }
    
    // default to lowest priority
    get priority () {
        return 1;
    }

    warn (msg) {
        this.vm.warn(msg);
    }

    init () {}

    create () {}

    mount () {}

    destroy () {}
}

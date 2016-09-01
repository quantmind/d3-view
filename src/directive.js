import uid from './uid';
import {warn} from './utils';

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

    constructor (model, el, attr, extra) {
        uid(this).init();
        this.model = model;
        this.el = el;
        this.name = attr.name;
        this.expression = attr.value;
        this.extra = extra;
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
        warn(msg);
    }

    execute () {
        this.el.removeAttribute(this.name);
        this.mount();
    }

    init () {}

    create () {}

    beforeMount () {}

    mount () {}

    destroy () {}
}

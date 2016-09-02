import {select} from 'd3-selection';
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

    constructor (el, attr, extra) {
        uid(this).init();
        this.el = el;
        this.name = attr.name;
        this.expression = attr.value;
        this.extra = extra;
        this.create();
    }

    get vm () {
        return this.model.$vm;
    }

    get sel () {
        return select(this.el);
    }

    // default to lowest priority
    get priority () {
        return 1;
    }

    warn (msg) {
        warn(msg);
    }

    removeAttribute () {
        this.el.removeAttribute(this.name);
        return this;
    }

    execute (model) {
        return this.removeAttribute().mount(model);
    }

    init () {}

    create () {}

    mount () {}

    destroy () {}
}

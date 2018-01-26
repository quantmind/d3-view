const JSDOM = require('jsdom').JSDOM;
const d3 = require('d3-view');
const view = d3.view;

const nextTick = d3.viewDebounce();

//
// render function
module.exports = {
    render (html, components) {
        if (!components) components = {};
        let vm = components;
        if (!vm.isd3) vm = view({components});
        var jsdom = new JSDOM(`<div id="root">${html}</div>`),
            sel = vm.select(jsdom.window.document).select('#root');
        return vm.mount(sel).then(() => new Render(vm, jsdom));
    },

    nextTick
};


function Render (vm, jsdom) {
    this.view = vm;
    this.jsdom = jsdom;
    this.window = jsdom.window;
}


Render.prototype = {
    constructor: Render,
    nextTick,

    tree (shallow) {
        return tree(this.view, shallow);
    },

    select (selector) {
        return this.view.sel.select(selector);
    },

    selectAll (selector) {
        return this.view.sel.selectAll(selector);
    },

    trigger (target, event, process) {
        var e = this.window.document.createEvent('HTMLEvents');
        e.initEvent(event, true, true);
        if (process) process(e);
        return target.dispatchEvent(e);
    },

    click (selector, process) {
        if (typeof selector === 'string') selector = this.view.sel.select(selector);
        var node = selector.node();
        if (!node) throw new Error('Cannot click on an empty element');
        return this.trigger(node, 'click', process);
    }
};

Object.defineProperties(Render.prototype, {

    component: {
        get () {
            var tree = this.tree(true);
            if (tree.children.length) return tree.children[0].component;
        }
    }
});


function getComponents (children, components, shallow) {
    let component;
    if (!components) components = [];

    children.forEach(el => {
        component = el.__d3_view__;
        if (component) components.push(shallow ? {component} : tree(component));
        else getComponents(Array.prototype.slice.call(el.children), components, shallow);
    });
    return components;
}


function tree(cm, shallow) {
    return {
        component: cm,
        children: getComponents(Array.prototype.slice.call(cm.el.children), null, shallow)
    };
}

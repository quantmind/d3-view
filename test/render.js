const JSDOM = require('jsdom').JSDOM;
const view = require('d3-view').view;

//
// render function
module.exports = function (html, components) {
    if (!components) components = {};
    let vm = components;
    if (!vm.isd3) vm = view({components});
    var jsdom = new JSDOM(`<div id="root">${html}</div>`),
        sel = vm.select(jsdom.window.document).select('#root');
    return vm.mount(sel).then(() => new Render(vm, jsdom));
};


function Render (vm, jsdom) {
    this.view = vm;
    this.jsdom = jsdom;
    this.window = jsdom.window;
}


Render.prototype = {
    constructor: Render,

    tree (shallow) {
        return tree(this.view, shallow);
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

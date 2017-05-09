import {selection} from 'd3-selection';

selection.prototype.mount = mount;

//
// mount function on a d3 selection
function mount () {
    return this.each(function () {
        var parent = this.parentNode,
            model;
        while (parent && !model) {
            model = parent.__model__;
            parent = parent.parentNode;
        }
        if (model) mountElement(this, model);
    });
}


function mountElement (element, model) {
    var vm = model.$vm,
        component = vm ? vm.components.get(element.tagName.toLowerCase()) : null;

    if (component)
        component({parent: vm}).mount(element);
    else
        element.children.forEach((child) => {
            mountElement(child, model);
        });
}

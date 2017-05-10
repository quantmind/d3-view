import {selection} from 'd3-selection';
import getdirs from './getdirs';

// Extend selection prototype with new methods
selection.prototype.mount = mount;
selection.prototype.model = model;
selection.prototype.directives = directives;


function directives (value) {
    return arguments.length
      ? this.property("__directives__", value)
      : this.node().__directives__;
}


function model (value) {
    return arguments.length
      ? this.property("__model__", value)
      : this.node().__model__;
}
//
// mount function on a d3 selection
// Use this function to mount the selection (useful when appending new html
function mount () {
    return this.each(function () {

        var parent = this.parentNode,
            model = this.__model__;

        while (parent && !model) {
            model = parent.__model__;
            parent = parent.parentNode;
        }

        if (model) mountElement(this, model);
    });
}


// mount an element into a given model
function mountElement (element, model) {
    var vm = model.$vm,
        component = vm ? vm.components.get(element.tagName.toLowerCase()) : null,
        directives = getdirs(element, vm ? vm.directives : null),
        preMount = directives.preMount();

    if (preMount)
        return preMount.execute(model);
    else {
        if (component)
            component({parent: vm}).mount(element, model);
        else {
            element.children.forEach((child) => {
                mountElement(child, model);
            });
        }

        if (directives.size())
            directives.forEach((d) => {
                d.execute(model);
            });
    }
}

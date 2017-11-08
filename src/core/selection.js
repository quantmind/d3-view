import {select, selection} from 'd3-selection';

import getdirs from './getdirs';
import slice from '../utils/slice';
import warn from '../utils/warn';


// Extend selection prototype with new methods
selection.prototype.mount = mount;
selection.prototype.view = view;
selection.prototype.model = model;
selection.prototype.directives = directives;


function directives (value) {
    return arguments.length
      ? this.property("__d3_directives__", value)
      : this.node().__d3_directives__;
}


function model () {
    var vm = this.view();
    return vm ? vm.model : null;
}


function view (value) {
    if (arguments.length) {
        return this.property("__d3_view__", value);
    } else {
        var element = this.node(),
            view = element ? element.__d3_view__ : null,
            parent = element ? element.parentNode : null;

        while (parent && !view) {
            view = parent.__d3_view__;
            parent = parent.parentNode;
        }
        return view;
    }
}

//
// mount function on a d3 selection
// Use this function to mount the selection
// THis method returns nothing or a promise
function mount (data, onMounted) {
    var promises = [];
    this.each(function () {
        var view = select(this).view();
        if (view) promises.push(mountElement(this, view, data, onMounted));
        else warn('Cannot mount, no view object available to mount to');
    });
    return Promise.all(promises);
}


// mount an element into a given model
function mountElement (element, vm, data, onMounted) {
    if (!element || !element.tagName) return;

    var component = vm.components.get(element.tagName.toLowerCase()),
        directives = getdirs(element, vm.directives),
        preMount = directives.preMount();

    if (preMount)
        return preMount.execute(vm.model);
    else {
        let promises;
        if (component)
            promises = [component({parent: vm}).mount(element, data, onMounted)];
        else
            promises = slice(element.children).map(c => mountElement(c, vm, data, onMounted));

        return Promise.all(promises).then(() => {
            return directives.execute(vm.model);
        });
    }
}

import {select, selection} from 'd3-selection';
import {isPromise} from 'd3-let';
import getdirs from './getdirs';

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
            view = element.__d3_view__,
            parent = element.parentNode;

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
// Return nothing or a promise
function mount () {
    var promises = [];
    let promise;
    this.each(function () {
        var view = select(this).view();
        if (view) {
            promise = mountElement(this, view);
            if (isPromise(promise)) promises.push(promise);
        }
    });
    if (promises.length)
        return Promise.all(promises);
}


// mount an element into a given model
function mountElement (element, vm) {
    var component = vm.components.get(element.tagName.toLowerCase()),
        directives = getdirs(element, vm.directives),
        preMount = directives.preMount();

    if (preMount)
        return preMount.execute(vm.model);
    else {
        let promise;
        if (component) {
            vm = component({parent: vm});
            promise = vm.mount(element);
        } else {
            var promises = [];
            for (let i=0; i<element.children.length; ++i) {
                promise = mountElement(element.children[i], vm);
                if (isPromise(promise)) promises.push(promise);
            }
            if (promises.length)
                promise = Promise.all(promises);
        }

        if (isPromise(promise))
            return promise.then(() => {
                return directives.execute(vm.model);
            });
        else
            return directives.execute(vm.model);
    }
}

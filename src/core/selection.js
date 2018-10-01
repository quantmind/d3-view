import { select, selection } from "d3-selection";
import slice from "../utils/slice";
import warn from "../utils/warn";
import getdirs from "./getdirs";

// Extend selection prototype with new methods
selection.prototype.mount = mount;
selection.prototype.view = view;
selection.prototype.model = model;
selection.prototype.directives = directives;

function directives(vm) {
  const node = this.node();
  let dirs = node.__d3_directives__;
  if (dirs === undefined) {
    dirs = getdirs(node, vm);
    // no point in storing the directive object if there are no directives or the node is not a component
    node.__d3_directives__ =
      dirs.size() || getComponent(node, vm) ? dirs : null;
  }
  return dirs ? dirs : getdirs(node);
}

function model() {
  var vm = this.view();
  return vm ? vm.model : null;
}

function view(value) {
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
// This method returns nothing or a promise
function mount(data) {
  var promises = [];
  this.each(function() {
    var view = select(this).view();
    if (view) promises.push(mountElement(this, view, data));
    else warn("Cannot mount, no view object available to mount to");
  });
  return Promise.all(promises);
}

// INTERNALS

// mount an element into a given model
const mountElement = (element, vm, data) => {
  if (!element || !element.tagName) return;

  var component = getComponent(element, vm),
    directives = select(element).directives(vm),
    preMount = directives.preMount();

  if (preMount) return preMount.execute(vm.model);
  else {
    if (component) {
      return component({ parent: vm })
        .mount(element, data)
        .then(cm => {
          directives.execute(cm.model);
          return cm;
        });
    } else {
      directives.execute(vm.model);
      return Promise.all(
        slice(element.children).map(c => mountElement(c, vm, data))
      );
    }
  }
};

const getComponent = (element, vm) => {
  return vm.components.get(element.tagName.toLowerCase());
};

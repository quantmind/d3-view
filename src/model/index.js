import {select} from 'd3-selection';
import asModel from './as';
import $get from './get';
import $set from './set';
import $on from './on';
import $update from './update';
import $child from './child';
import $setbase from './setbase';

import {warn} from '../utils';
import getdirs from '../getdirs';

//
//  Model class
//
//  The model is at the core of d3-view reactive data component
function Model (initials) {
    asModel(this, initials);
}

export function model (initials) {
    return new Model(initials);
}

model.prototype = Model.prototype;

// Public API methods
Model.prototype.$on = $on;
Model.prototype.$update = $update;
Model.prototype.$get = $get;
Model.prototype.$set = $set;
Model.prototype.$child = $child;
Model.prototype.$setbase = $setbase;
Model.prototype.$mount = $mount;
Model.prototype.warn = warn;


function $mount (el) {
    var directives = getdirs(el, this.$directives),
        model = createModel(directives, this),
        loop = directives.pop('for');

    if (loop) {
        loop.execute(model);
        return true;    // Important - skip mounting a component
    } else {
        var sel = select(el);
        if (!sel.model()) sel.model(model);
        mountChildren(sel);
    }
}

// Model factory function
export function createModel (directives, parent, data) {
    var dir = directives.pop('model');

    // For loop directive not permitted in the root view
    if (directives.get('for') && !parent) {
        warn(`Cannot have a "d3-for" directive in the root view element`);
        directives.pop('for');
    }

    if (!parent) {
        if (dir) warn(`Cannot have a d3-model directive in the root element`);
        return new Model(data);
    }

    // Execute model directive
    if (dir) {
        dir.execute(parent);
        var model = dir.sel.model();
        if (model) model.$update(data);
        return model;
    }
    else if (data)
        return parent.$child(data);
    else // don't create a new model if not needed it
        return parent;
}


function mountChildren (sel) {
    var directives = getdirs(sel.node()),
        model = sel.model();

    sel.selectAll(function () {
        return this.children;
    }).each(function () {
        var Component = model.$components.get(this.tagName.toLowerCase());

        if (Component)
            new Component({
                el: this,
                parent: model
            }).mount();
        else
            model.$mount(this);
    });


    // Execute directives
    directives.forEach((d) => {
        d.execute(model);
    });
}

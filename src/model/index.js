import asModel from './as';
import $get from './get';
import $set from './set';
import $on from './on';
import $update from './update';
import $child from './child';
import $setbase from './setbase';
import mountChildren from './mount';

import {warn} from '../utils';
import getdirs from '../getdirs';


export default function Model (initials) {
    asModel(this, initials);
}

// Public API methods
Model.prototype.$on = $on;
Model.prototype.$update = $update;
Model.prototype.$get = $get;
Model.prototype.$set = $set;
Model.prototype.$child = $child;
Model.prototype.$mount = $mount;
Model.prototype.$setbase = $setbase;
Model.prototype.warn = warn;
Model.create = createModel;


// Model factory function
function createModel (directives, parent, data) {
    var dir = directives.pop('model');

    // For loop directive not permitted in the root view
    if (directives.get('for') && !parent) {
        warn(`Cannot have a "d3-for" directive in the root element`);
        directives.pop('for');
    }

    if (!parent) {
        if (dir) warn(`Cannot have a d3-model directive in the root element`);
        return new Model(data);
    }

    if (dir) {
        dir.mount(parent);
        return dir.model.$update(data);
    } else if (data)
        return parent.$child(data);
    else // don't create a new model if not needed it
        return parent;
}


function $mount (el) {
    var directives = getdirs(el, this.$directives),
        model = Model.create(directives, this),
        loop = directives.pop('for');

    if (loop) loop.execute(model);
    else mountChildren(el);
}

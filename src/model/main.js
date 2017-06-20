import asModel from './as';
import string from './string';
import $get from './get';
import $set from './set';
import $on from './on';
import $update from './update';
import $setbase from './setbase';
import $off from './off';
import $change from './change';

//
//  Model class
//
//  The model is at the core of d3-view reactive data component
function Model (initials) {
    asModel(this, initials);
}

export default function model (initials) {
    return new Model(initials);
}

model.prototype = Model.prototype;

// Public API methods
Model.prototype.toString = string;
Model.prototype.$on = $on;
Model.prototype.$change = $change;
Model.prototype.$update = $update;
Model.prototype.$get = $get;
Model.prototype.$set = $set;
Model.prototype.$new = $new;
Model.prototype.$setbase = $setbase;
Model.prototype.$off = $off;


function $new (initials) {

    var parent = this,
        child = model(initials);

    Object.defineProperty(child, 'parent', {
        get: function () {
            return parent;
        }
    });

    return child;
}

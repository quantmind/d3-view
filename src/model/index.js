import asModel from './as';
import $get from './get';
import $set from './set';
import $on from './on';
import $update from './update';
import $child from './child';
import $setbase from './setbase';

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
Model.prototype.$on = $on;
Model.prototype.$update = $update;
Model.prototype.$get = $get;
Model.prototype.$set = $set;
Model.prototype.$child = $child;
Model.prototype.$setbase = $setbase;

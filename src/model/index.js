import asModel from './as';
import $get from './get';
import $set from './set';
import $on from './on';
import $update from './update';
import $child from './child';
import $mount from './mount';
import $setbase from './setbase';
import {warn} from '../utils';


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

import asModel from './as';
import toString from './string';
import $set from './set';
import $on from './on';
import $update from './update';
import $off from './off';
import $change from './change';
import $isReactive from './isreactive';
import $owner from './owner';

//
//  Model class
//
//  The model is at the core of d3-view reactive data component
function Model (initials, parent) {
    asModel(this, initials, parent, true);
}

export default function model (initials) {
    return new Model(initials);
}

model.prototype = Model.prototype = {
    constructor: Model,
    // Public API methods
    toString,
    $on,
    $change,
    $update,
    $set,
    $new,
    $off,
    $isReactive,
    $owner
};

Object.defineProperty(Model.prototype, 'root', {
    get: function () {
        return this.parent ? this.parent.root : this;
    }
});


function $new (initials) {
    return new Model(initials, this);
}

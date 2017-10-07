import asModel from './as';
import string from './string';
import $set from './set';
import $on from './on';
import $update from './update';
import $off from './off';
import $change from './change';
import $isreactive from './isreactive';

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
Model.prototype.$set = $set;
Model.prototype.$new = $new;
Model.prototype.$off = $off;
Model.prototype.$isReactive = $isreactive;
Object.defineProperty(Model.prototype, 'root', {
    get: function () {
        return this.parent ? this.parent.root : this;
    }
});


function $new (initials) {

    var parent = this,
        child = model(initials);

    Object.defineProperties(child, {
        parent: {
            get () {
                return parent;
            },
        },
        isolated: {
            get () {
                return true;
            }
        }
    });

    return child;
}

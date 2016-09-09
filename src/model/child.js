import asModel from './as';

// create a child model
export default function (initials) {
    if (!this._Child) this._Child = createChildConstructor(this);

    var parent = this,
        child = new this._Child(initials);

    Object.defineProperty(child, 'parent', {
        get: function () {
            return parent;
        }
    });

    return child;
}


function createChildConstructor (model) {

    function Child (initials) {
        asModel(this, initials);
    }

    Child.prototype = model;
    return Child;
}

import {map} from 'd3-collection';
import {dispatch} from 'd3-dispatch';

import uid from '../utils/uid';

//
// Initialise a model
export default function asModel (model, initials) {
    var events = map(),
        children = [],
        Child = null;

    // event handler for any change in the model
    events.set('', dispatch('change'));

    Object.defineProperties(uid(model), {
        $events: {
            get: function () {
                return events;
            }
        },
        $children: {
            get: function () {
                return children;
            }
        }
    });
    model.$child = $child;
    model.$update(initials);

    function $child (o) {
        if (Child === null) Child = createChildConstructor(model);
        return new Child(o);
    }
}


function createChildConstructor (model) {

    function Child (initials) {
        asModel(this, initials);
        model.$children.push(this);
        Object.defineProperty(this, 'parent', {
            get: function () {
                return model;
            }
        });
    }

    Child.prototype = model;
    return Child;
}


export function elModel (el, model) {
    if (arguments.length === 2) {
        el.__model__ = model;
        return el;
    } return el.__model__;
}

import {map} from 'd3-collection';
import {dispatch} from 'd3-dispatch';

import debounce from '../utils/debounce';
import uid from '../utils/uid';


const slice = Array.prototype.slice;

//
// Initialise a model
export default function asModel (model, initials) {
    var events = map(),
        children = [],
        Child = null;

    // event handler for any change in the model
    events.set('', debounceDispatch());

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


export function debounceDispatch () {
    var events = dispatch('change');

    return {
        on () {
            if (arguments.length < 2)
                return events.on.apply(events, slice.call(arguments));
            events.on.apply(events, slice.call(arguments));
            return this;
        },
        trigger: debounce(function () {
            events.call('change', slice.call(arguments));
        })
    };
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

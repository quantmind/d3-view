import {map} from 'd3-collection';

import uid from '../utils/uid';
import ddispatch from './dispatch';

//
// Initialise a model
export default function asModel (model, initials) {
    var events = map(),
        Child = null;

    // event handler for any change in the model
    events.set('', ddispatch());

    Object.defineProperties(uid(model), {
        $events: {
            get () {
                return events;
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
        Object.defineProperties(this, {
            parent: {
                get () {
                    return model;
                }
            },
            isolated: {
                get () {
                    return false;
                }
            }
        });
    }

    Child.prototype = model;
    return Child;
}

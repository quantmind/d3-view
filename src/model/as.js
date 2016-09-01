import {map} from 'd3-collection';
import {dispatch} from 'd3-dispatch';

import uid from '../uid';

export default function (model, initials) {
    var events = map(),
        element;

    // event handler for any change in the model
    events.set('', dispatch('change'));

    Object.defineProperty(uid(model), '$events', {
        get: function () {
            return events;
        }
    });

    Object.defineProperty(model, '$el', {
        get: function () {
            return element;
        },
        set: function (el) {
            element = el;
            element.__model__ = model;
        }
    });

    model.$update(initials);
}

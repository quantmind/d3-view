import {selection} from 'd3-selection';
import {map} from 'd3-collection';
import {dispatch} from 'd3-dispatch';

import uid from '../utils/uid';


selection.prototype.model = model;


export default function (model, initials) {
    var events = map();

    // event handler for any change in the model
    events.set('', dispatch('change'));

    Object.defineProperty(uid(model), '$events', {
        get: function () {
            return events;
        }
    });

    model.$update(initials);
}


export function elModel (el, model) {
    if (arguments.length === 2) {
        el.__model__ = model;
        return el;
    } return el.__model__;
}


function model (value) {
    return arguments.length
      ? this.property("__model__", value)
      : this.node().__model__;
}

import {dispatch} from 'd3-dispatch';
import {isFunction, isObject} from 'd3-let';

import debounce from '../utils/debounce';


//  $set a reactive attribute for a Model
//
//  Set the value of a dotted attribute in the model or its parents
//  If the attribute is not already reactive make it as such.
//
export default function (key, value) {
    // property not reactive - make it as such
    if (!this.$events.get(key)) reactive(this, key, value);
    else this[key] = value;
}


function reactive(model, key, value) {
    var events = model.$events,
        oldValue,
        lazy;

    events.set(key, dispatch('change'));

    Object.defineProperty(model, key, property());

    // the event is fired at the next tick of the event loop
    // Cannot use the () => notation here otherwise arguments are incorrect
    var trigger = debounce(function () {
        oldValue = arguments[0];
        events.get(key).call('change', model, value, oldValue);
        // trigger model change event only when not a lazy property
        if (!lazy) events.get('').call('change', model, key);
    });

    // Trigger the callback once for initialization
    trigger();

    function update (newValue) {
        if (lazy) newValue = lazy.get.call(model);
        if (newValue === value) return;
        // trigger lazy callbacks
        trigger(value);
        // update the value
        value = newValue;
    }

    function property () {
        var prop = {
                get: function () {
                    return value;
                }
            };

        if (isFunction(value)) value = {get: value};

        // calculated attribute
        if (isObject(value) && isFunction(value.get)) {
            lazy = value;
            value = lazy.get.call(model);

            if (lazy.reactOn)
                lazy.reactOn.forEach((name) => {
                    model.$on(`${name}.${key}`, update);
                });
            else
                model.$on(`.${key}`, update);

            if (isFunction(lazy.set)) prop.set = lazy.set;
        } else
            prop.set = update;

        return prop;
    }
}

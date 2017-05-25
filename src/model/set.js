import {isFunction, isObject} from 'd3-let';

import ddispatch from './dispatch';

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
        lazy;

    events.set(key, ddispatch());

    Object.defineProperty(model, key, property());

    // Trigger the callback once for initialization
    trigger();

    function update (newValue) {
        if (lazy) newValue = lazy.get.call(model);
        if (newValue === value) return;
        // trigger lazy callbacks
        var oldValue = value;
        value = newValue;
        trigger(oldValue);
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

    function trigger (oldValue) {
        events.get(key).trigger(model, oldValue);
        // trigger model change event only when not a lazy property
        if (!lazy) events.get('').trigger(model, key);
    }
}

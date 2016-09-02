import {dispatch} from 'd3-dispatch';
import {isFunction, isObject} from 'd3-let';
import {debounce} from '../utils';


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

    var trigger = debounce(() => {
        oldValue = arguments[0];
        events.get(key).call('change', model, value, oldValue);
        events.get('').call('change', model);
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
            model.$on(`.${key}`, update);
        } else
            prop.set = update;

        return prop;
    }
}

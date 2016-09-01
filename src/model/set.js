import {timeout} from 'd3-timer';
import {dispatch} from 'd3-dispatch';
import {isFunction, isObject} from 'd3-let';


//  $set a reactive attribute for a Model
//
//  Set the value of a dotted attribute in the model or its parents
//  If the attribute is not already reactive make it as such.
//
export default function (key, value) {
    var model = this,
        events = model.$events,
        reactive = events.get(key);

    if (!reactive) {
        Object.defineProperty(model, key, property());
        timeout(() => {
            events.get('').call('change', model);
        });
    }
    else
        model[key] = value;

    function update (newValue) {
        var oldValue = value;
        value = newValue;
        events.get(key).call('change', model, value, oldValue);
        events.get('').call('change', model);
    }

    function property () {
        var lazy,
            prop = {
                get: function () {
                    return value;
                }
            };

        events.set(key, dispatch('change'));

        if (isFunction(value)) value = {get: value};

        if (isObject(value) && isFunction(value.get)) {
            lazy = value;
            value = lazy.get.call(model);
            model.$on(`.${key}`, () => {
                var newValue = lazy.get.call(model);
                if (newValue === value) return;
                update(newValue);
            });
        } else
            prop.set = function (newValue) {
                if (newValue === value) return;
                // Schedule change event at the next event loop tick
                timeout(() => {
                    update(newValue);
                });
            };

        return prop;
    }
}



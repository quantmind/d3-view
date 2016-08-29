import {dispatch} from 'd3-dispatch';
import {timeout} from 'd3-timer';
import {isObject, isFunction} from 'd3-let';
import {map} from 'd3-collection';

let UID = 0;


export default function (vm, initials) {
    var model = this,
        properties = map(),
        uid = ++UID;

    properties.set('', dispatch('change'));

    function property (key, value) {
        var lazy,
            prop = {
                get: function () {
                    return value;
                }
            };

        properties.set(key, dispatch('change'));

        function update (newValue) {
            var oldValue = value;
            value = newValue;
            properties.get(key).call('change', model, value, oldValue);
            properties.get('').call('change', model);
        }

        if (isFunction(value)) value = {get: value};

        if (isObject(value) && isFunction(value.get)) {
            lazy = value;
            value = lazy.get.call(model);
            on(`.${key}`, () => {
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

        timeout(() => {
            properties.get('').call('change', model);
        });
        return prop;
    }

    function on (name, callback) {
        if (arguments.length === 1 && isFunction(name)) {
            callback = name;
            name = '';
        }
        var bits = name.split('.'),
            key = bits[0];
        if (!properties.has(key)) return vm.warn(`Cannot bind to "${key}" - no such reactive property`);
        bits[0] = 'change';
        return properties.get(key).on(bits.join('.'), callback);
    }

    function update (data) {
        if (!data) return;
        for(var key in data)
            setValue(key, data[key]);
    }

    function setValue (key, value) {
        if (key in model)
            model[key] = value;
        else
            Object.defineProperty(model, key, property(key, value));
    }

    update(initials);

    // Public API.
    model.$on = on;
    model.$update = update;
    model.$set = setValue;

    Object.defineProperty(model, '$uid', {
        get: function () {
            return uid;
        }
    });
}

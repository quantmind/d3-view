import {dispatch} from 'd3-dispatch';
import {timeout} from 'd3-timer';
import {select} from 'd3-selection';
import {isObject, isFunction} from 'd3-let';
import {map} from 'd3-collection';

let UID = 0;

// Hierarchical Reactive Model
export default function (vm, initials) {
    var model = this,
        properties = map(),
        uid = ++UID;

    // event handler for any change in the model
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
        if (!properties.has(key)) {
            if (!model.$parent) return vm.warn(`Cannot bind to "${key}" - no such reactive property`);
            return model.$parent.$on(name, callback);
        }
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

    function getValue (key) {
        if (key in model) return model[key];
        else if (model.$parent) return model.$parent.$get(key);
    }

    // create a child model
    function createChild (data, element) {
        var child = new model.constructor(vm, data);
        child.$parent = model;
        if (element) {
            child.$el = element;
            select(element).datum(child);
        }
        return child;
    }

    update(initials);

    // Public API.
    model.$on = on;
    model.$update = update;
    model.$set = setValue;
    model.$get = getValue;
    model.$child = createChild;


    Object.defineProperty(model, '$uid', {
        get: function () {
            return uid;
        }
    });

    Object.defineProperty(model, '$vm', {
        get: function () {
            return vm;
        }
    });
}

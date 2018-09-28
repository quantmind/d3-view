import { isArray, isFunction, isObject } from "d3-let";
import isVanillaObject from "../utils/object";
import providers from "../utils/providers";
import ddispatch from "./dispatch";

//  $set a reactive attribute for a Model
//
//  Set the value of an attribute in the model
//  If the attribute is not already reactive make it as such.
//
export default function(key, value) {
  // property not reactive - make it as such
  if (key.substring(0, 1) === "$") {
    if (this.constructor.prototype[key])
      this.$logWarn(`Cannot set attribute method ${key}, it is protected`);
    else this[key] = value;
  } else if (!this.$events.get(key)) reactive(this, key, value);
  else this[key] = value;
}

const isModel = value =>
  isObject(value) && value.toString() === "[object d3Model]";

const reactive = (model, key, value) => {
  var lazy;

  model.$events.set(key, ddispatch());

  Object.defineProperty(model, key, property());

  // Create a new model if value is an object
  value = typeValue(value);
  // Trigger the callback once for initialization
  model.$change(key);

  function update(newValue) {
    if (lazy) newValue = lazy.get.call(model);
    if (newValue === value) return;
    // trigger lazy callbacks
    //
    // Fire model events
    if (providers.logger.debug) {
      var modelName = model.$$name || "model";
      providers.logger.debug(`[d3-model] updating ${modelName}.${key}`);
    }
    model.$change(key, value).$change();
    value = typeValue(newValue, value);
  }

  function property() {
    var prop = {
      get: function() {
        return value;
      }
    };

    if (isFunction(value)) value = { get: value };

    // calculated attribute
    if (isVanillaObject(value) && isFunction(value.get)) {
      lazy = value;
      value = lazy.get.call(model);

      if (lazy.reactOn)
        lazy.reactOn.forEach(name => {
          model.$on(`${name}.${key}`, update);
        });
      else
        model.$logWarn(
          `reactive lazy property ${key} does not specify 'reactOn' list or properties`
        );

      if (isFunction(lazy.set)) prop.set = lazy.set;
    } else prop.set = update;

    return prop;
  }

  function typeValue(newValue, oldValue) {
    if (newValue === oldValue) return oldValue;
    else if (isArray(newValue)) return arrayValue(newValue, oldValue);
    else if (isModel(oldValue)) return modelValue(newValue, oldValue);
    else return isVanillaObject(newValue) ? model.$new(newValue) : newValue;
  }

  function arrayValue(newValue, oldValue) {
    if (isModel(oldValue)) oldValue.$off();
    if (!isArray(oldValue)) oldValue = [];
    for (let i = 0; i < newValue.length; ++i)
      newValue[i] = typeValue(newValue[i], oldValue[i]);
    return newValue;
  }

  function modelValue(newValue, oldValue) {
    if (isVanillaObject(newValue)) {
      oldValue.$update(newValue);
      return oldValue;
    } else {
      oldValue.$off();
      return typeValue(newValue);
    }
  }
};

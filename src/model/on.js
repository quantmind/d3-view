import { isFunction } from "d3-let";
import warn from "../utils/warn";

// Add change callback to a model reactive attribute
export default function(name, callback) {
  // When no name is provided, wait for changes on this model - no its parents
  if (arguments.length === 1 && isFunction(name)) {
    callback = name;
    name = "";
  }

  var bits = name.split("."),
    key = bits[0],
    event = getEvent(this, key);

  if (!event)
    return warn(`Cannot bind to "${key}" - no such reactive property`);

  // event from a parent model, add model uid to distinguish it from other child callbacks
  if (!this.$events.get(key)) bits.push(this.uid);

  bits[0] = "change";
  return event.on(bits.join("."), callback);
}

function getEvent(model, name) {
  var event = model.$events.get(name);
  if (!event && model.parent) return getEvent(model.parent, name);
  return event;
}

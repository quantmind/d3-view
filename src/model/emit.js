import { isFunction } from "d3-let";

//
//  Emit a custom event Name up the chain of parent models
export default function(eventName, data) {
  var name = "$" + eventName;
  propagate(this, name, data, this);
  return this;
}

function propagate(model, name, data, originModel) {
  if (!model) return;
  if (model.hasOwnProperty(name) && isFunction(model[name])) {
    if (model[name](data, originModel) === false) return;
  }
  propagate(model.parent, name, data, originModel);
}

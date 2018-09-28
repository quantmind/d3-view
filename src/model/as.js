import uid from "../utils/uid";
import ddispatch from "./dispatch";

//
// Initialise a model
export default function asModel(model, initials, parent, isolated) {
  var events = new Map(),
    Child = null;

  // event handler for any change in the model
  events.set("", ddispatch());

  Object.defineProperties(uid(model), {
    $events: {
      get() {
        return events;
      }
    },
    parent: {
      get() {
        return parent;
      }
    },
    isolated: {
      get() {
        return isolated;
      }
    }
  });
  model.$child = $child;
  model.$update(initials);

  function $child(o) {
    if (Child === null) Child = createChildConstructor(model);
    return new Child(o);
  }
}

function createChildConstructor(model) {
  function Child(initials) {
    asModel(this, initials, model, false);
  }

  Child.prototype = model;
  return Child;
}

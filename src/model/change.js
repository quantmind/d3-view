import slice from "../utils/slice";
import warn from "../utils/warn";

// trigger change event on a model reactive attribute
export default function(attribute) {
  var name = arguments.length ? attribute : "",
    event = this.$events.get(name),
    args = slice(arguments, 1);
  if (event) event.trigger.apply(this, args);
  else if (!this.isolated) this.parent.$change(name);
  else warn(`attribute '${name}' is not a reactive property this model`);
  return this;
}

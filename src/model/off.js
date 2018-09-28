// remove event handlers
export default function(attr) {
  if (attr === undefined) this.$events.forEach(event => removeEvent(event));
  else {
    var bits = attr.split("."),
      type = bits.splice(0, 1)[0],
      event = this.$events.get(type);
    if (event) removeEvent(event, bits.join("."));
  }
}

function removeEvent(event, name) {
  if (name) event.on(`change.${name}`, null);
  else event.on("change", null);
}

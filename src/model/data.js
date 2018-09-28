const serialTypes = new Set([Boolean, String, Number]);

export default function() {
  var model = this,
    data = {},
    keys = Array.from(this.$events.keys()).concat(Object.keys(this)),
    value;

  keys.forEach(key => {
    if (key && key.substring(0, 1) !== "$") {
      value = getValue(model[key]);
      if (value !== undefined) data[key] = value;
    }
  });
  return data;
}

function getValue(value) {
  if (!value) return value;
  else if (value.constructor === Array) return value.map(getValue);
  else if (typeof value.$data === "function") return value.$data();
  else if (serialTypes.has(value.constructor)) return value;
}

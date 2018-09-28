// Update a model with reactive model data
export default function(data, replace) {
  if (data) {
    replace = arguments.length === 2 ? replace : true;
    for (var key in data) {
      if (replace || this[key] === undefined) this.$set(key, data[key]);
    }
  }
  return this;
}

export function $push(attr, value) {
  var array = this[attr].slice();
  array.push(value);
  this[attr] = array;
  return this;
}

export function $splice(attr, idx, count) {
  var array = this[attr].slice();
  if (arguments.length == 2) array.splice(idx);
  else if (arguments.length == 3) array.splice(idx, count);
  this[attr] = array;
  return this;
}

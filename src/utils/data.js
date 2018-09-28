const DATAPREFIX = "data";

export default attrs => {
  let p, bits;
  return Object.keys(attrs).reduce((o, key) => {
    bits = key.split("-");
    if (bits.length > 1 && bits[0] === DATAPREFIX) bits = bits.splice(1);
    p = bits.reduce((s, key, idx) => {
      s += idx ? key.substring(0, 1).toUpperCase() + key.substring(1) : key;
      return s;
    }, "");
    o[p] = attrs[key];
    return o;
  }, {});
};

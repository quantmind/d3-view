export default function Cache() {
  this.active = true;
  this.data = new Map();
}

Cache.prototype = {
  constructor: Cache,
  set(key, value) {
    if (this.active) this.data.set(key, value);
  },
  get(key) {
    if (this.active) return this.data.get(key);
  },
  has(key) {
    if (this.active) return this.data.has(key);
    return false;
  },
  clear() {
    return this.data.clear();
  },
  delete(key) {
    return this.data.delete(key);
  }
};

export default function setbase (key, value) {
    if (!this.$events.has(key) && this.$parent) return setbase.call(this.$parent, key, value);
    this.$set(key, value);
}

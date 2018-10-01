//
//check if an attribute is a reactive attribute for the model (or its prototypical parent)
export default function(attr) {
  if (!this.$events.has(attr)) {
    if (!this.parent || this.isolated) return false;
    return this.parent.$isReactive(attr);
  }
  return true;
}

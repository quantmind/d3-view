//
//  Return the model owning the reactive attribute attr
export default function(attr) {
  if (!this.$events.has(attr))
    return this.parent ? this.parent.$owner(attr) : undefined;
  return this;
}

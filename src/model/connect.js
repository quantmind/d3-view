import ddispatch from "./dispatch";
//
//  Connect a model attribute with another model attribute
//  The attribute is read-only on the model an it reacts on parent changes
export default function(attr, parentAttr, owner) {
  if (this.$events.has(attr))
    return this.$logWarn(
      `cannot connect ${attr} attribute, it is already reactive`
    );

  parentAttr = parentAttr || attr;
  owner = (owner || this).$owner(parentAttr);
  if (!owner)
    return this.$logWarn(`cannot find model with attribute ${parentAttr}`);
  //
  const dd = ddispatch();
  this.$events.set(attr, dd);
  Object.defineProperty(this, attr, {
    get() {
      return owner[parentAttr];
    },
    set() {
      this.$logWarn(
        `Cannot set "${attr}" value because it is owned by a parent model`
      );
    }
  });
  owner.$events.get(parentAttr).on(`change.${this.uid}`, () => {
    dd.change.apply(this, arguments);
    if (owner != this) this.$events.get("").change.apply(this);
  });
}

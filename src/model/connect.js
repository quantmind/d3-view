//
//  Connect a model attribute with another model attribute
//  The attribute is read-only on the model an it reacts on parent changes
export default function (attr, parentAttr, owner) {
    parentAttr = parentAttr || attr;
    if (!owner) {
        if (!this.parent) return this.$logWarn('cannot connect on root model');
        owner = this.parent.owner(parentAttr);
        if (!owner) return this.$logWarn(`cannot find ancestor model with attribute ${parentAttr}`);
    }
    if (owner === this) return this.$logWarn(`cannot connect to self`);
    //
    Object.defineProperty(this, attr, {
        get () {
            return owner[parentAttr];
        },
        set () {
            this.$logWarn(`Cannot set "${attr}" value because it is owned by a parent model`);
        }
    });
    owner.$on(`parentAttr.${this.uid}`, () => this.$change(attr));
}

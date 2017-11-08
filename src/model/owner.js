//
//  Return the model owning the reactive attribute attr
export default function (attr) {
    if (!this.$events.has(attr)) {
        if (!this.parent || this.isolated) return;
        return this.parent.$owner(attr);
    }
    return this;
}

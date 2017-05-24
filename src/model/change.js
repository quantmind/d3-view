// trigger change event on a model reactive attribute
export default function (attribute) {
    var event = this.$events.get(attribute);
    if (event) event.trigger();
    return this;
}

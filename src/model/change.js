import warn from '../utils/warn';

// trigger change event on a model reactive attribute
export default function (attribute) {
    var event = this.$events.get(attribute);
    if (event) event.trigger();
    else warn(`attribute '${attribute}' is not a reactive property this model`);
    return this;
}

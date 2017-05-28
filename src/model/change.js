import warn from '../utils/warn';
import slice from '../utils/slice';


// trigger change event on a model reactive attribute
export default function (attribute) {
    var event = this.$events.get(attribute),
        args = slice(arguments, 1);
    if (event) event.trigger.call(this, ...args);
    else warn(`attribute '${attribute}' is not a reactive property this model`);
    return this;
}

import {isFunction} from 'd3-let';

//
//  Emit a custom event Name up the chain of parent models
export default function (eventName, data) {
    var name = '$' + eventName;
    propagate(this.parent, name, data);
    return this;
}


function propagate (model, name, data) {
    if (!model) return;
    if (isFunction(model[name])) model[name](data);
    propagate(model.paranet, name, data);
}

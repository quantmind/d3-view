//  $get method for an HRM
//
//  attribute is a dotted string
export default function (attribute) {

    var bits = attribute.split('.'),
        key = bits.splice(0, 1),
        model = getModel(this, key);

    if (!(key in model)) return;

    var value = model[key];

    while (value && bits.length)
        value = value[bits.splice(0, 1)];

    return value;
}


export function getModel (model, key) {

    while (!(key in model) && model.$parent)
        model = model.$parent;

    return model;
}

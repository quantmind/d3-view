export default function () {
    var model = this,
        data = {},
        keys = Array.from(this.$events.keys()).concat(Object.keys(this)),
        value;

    keys.forEach(key => {
        if (key) {
            value = getValue(model[key]);
            if (value !== undefined) data[key] = value;
        }
    });
    return data;
}


function getValue (value) {
    if (typeof value === 'function') return;
    if (value && typeof value.$data === 'function') return value.$data();
    return value;
}

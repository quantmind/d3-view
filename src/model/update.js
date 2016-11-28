import warn from '../utils/warn';

// Update a model with reactive model data
export default function (data, replace) {
    if (data)
        replace = arguments.length === 2 ? replace : true;
        for (var key in data) {
            if (replace || this[key] === undefined) {
                if (key.substring(0, 1) === '$') {
                    if (this.constructor.prototype[key]) warn(`Cannot set attribute method ${key}, it is protected`);
                    else this[key] = data[key];
                } else
                    this.$set(key, data[key]);
            }
        }
    return this;
}

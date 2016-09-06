import {warn} from '../utils';

// Update a model with reactive model data
export default function (data) {
    if (data)
        for (var key in data) {
            if (key.substring(0, 1) === '$') {
                if (this.constructor.prototype[key]) warn(`Cannot set attribute method ${key}, it is protected`);
                else this[key] = data[key];
            } else
                this.$set(key, data[key]);
        }
    return this;
}

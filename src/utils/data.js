import {pop} from 'd3-let';

const DATAPREFIX = 'data-';


export default function (attrs) {
    var keys = Object.keys(attrs);
    let p;
    return keys.reduce((o, key) => {
        if (key.substring(0, 5) === DATAPREFIX) {
            p = key.split('-').splice(1).reduce((s, key, idx) => {
                s += idx ? key.substring(0, 1).toUpperCase() + key.substring(1) : key;
                return s;
            }, '');
            o[p] = pop(attrs, key);
        }
        return o;
    }, {});
}

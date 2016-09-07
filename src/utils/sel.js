import {select} from 'd3-selection';


export default function (o) {

    Object.defineProperty(o, 'sel', {
        get: function () {
            return select(this.el);
        }
    });

    return o;
}

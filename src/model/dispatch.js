import {dispatch} from 'd3-dispatch';

import debounce from '../utils/debounce';


const slice = Array.prototype.slice;


export default function () {
    var events = dispatch('change');

    return {
        on (typename, callback) {
            if (arguments.length < 2)
                return events.on(typename);
            events.on(typename, callback);
            return this;
        },
        trigger: debounce(function () {
            events.apply('change', arguments[0], slice.call(arguments, 1));
        })
    };
}

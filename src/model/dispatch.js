import {dispatch} from 'd3-dispatch';

import debounce from '../utils/debounce';


export default function () {
    var events = dispatch('change'),
        triggered = 0;

    return {
        on (typename, callback) {
            if (arguments.length < 2)
                return events.on(typename);
            events.on(typename, callback);
            return this;
        },
        trigger: debounce(function () {
            events.apply('change', this, arguments);
            triggered +=1;
        }),
        triggered () {
            return triggered;
        }
    };
}

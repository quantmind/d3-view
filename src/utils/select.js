import {isFunction} from 'd3-let';
import {select} from 'd3-selection';


export default function (el) {
    if (el && !isFunction(el.size)) return select(el);
    return el;
}

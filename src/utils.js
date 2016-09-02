import {select} from 'd3-selection';
import {timeout} from 'd3-timer';
import {logger, isFunction} from 'd3-let';

const prefix = '[d3-view]';

var providers = {
    logger: logger
};


export function warn (msg) {
    providers.logger.warn(`${prefix} ${msg}`);
}


export function asSelect (el) {
    if (el && !isFunction(el.size)) return select(el);
    return el;
}


export function debounce (callback) {
    var queued = false;
    return function () {
        if (!queued) {
            var args = Array.prototype.slice.call(arguments);
            queued = true;
            timeout(() => {
                queued = false;
                callback.apply(undefined, args);
            });
        }
    };
}


export function isCreator (el) {
    if (arguments.length === 2) el.__template__ = arguments[1];
    else return el.__template__;
}


export default providers;

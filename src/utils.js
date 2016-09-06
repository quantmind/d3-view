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

// Add callback to execute when the DOM is ready
export function domReady (callback) {
    readyCallbacks.push(callback);
    if (document.readyState !== 'complete') {
        document.addEventListener('DOMContentLoaded', _completed);
        // A fallback to window.onload, that will always work
        window.addEventListener('load', _completed);
    }
    else
        _domReady();
}


export default providers;



var readyCallbacks = [];

function _completed () {
    document.removeEventListener('DOMContentLoaded', _completed);
	window.removeEventListener('load', _completed);
    _domReady();
}


function _domReady() {
    let callback;
    while (readyCallbacks.length ) {
        callback = readyCallbacks.shift();
        timeout(callback);
    }
}

import {timeout} from 'd3-timer';

export default function (callback, delay) {
    var queued = false;
    return function () {
        if (!queued) {
            var args = Array.prototype.slice.call(arguments);
            queued = true;
            timeout(() => {
                queued = false;
                callback.apply(undefined, args);
            }, delay);
        }
    };
}

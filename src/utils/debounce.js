import {timeout} from 'd3-timer';

//
// Evaluate a callback (optional) with given delay (optional)
//
// if delay is not given or 0, the callback is evaluated at the next tick
// of the event loop.
// Calling this method multiple times in the dsame event loop tick produces
// always the initial promise
export default function (callback, delay) {
    var promise = null;

    return function () {
        if (promise !== null) return promise;
        var self = this,
            args = arguments;

        promise = new Promise((resolve, reject) => {

            timeout(() => {
                promise = null;
                try {
                    resolve(callback ? callback.apply(self, args) : undefined);
                } catch (err) {
                    reject(err);
                }
            }, delay);
        });

        return promise;
    };
}

import { timeout } from "d3-timer";

//
// Evaluate a callback (optional) with given delay (optional)
//
// if delay is not given or 0, the callback is evaluated at the next tick
// of the event loop.
// Calling this method multiple times in the same event loop tick produces
// always the initial promise
export default (callback, delay) => {
  let promise = null,
    self,
    args;

  function debounce(...rest) {
    self = this;
    args = rest;
    if (promise !== null) return promise;

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
  }

  debounce.promise = () => promise;

  return debounce;
};

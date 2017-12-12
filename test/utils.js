import 'es6-promise';
import {view, viewProviders, viewDebounce, isAbsoluteUrl} from '../index';
import fixtures from './fixtures/fetch';
import promise from './promise';
import 'd3-transition';

viewProviders.compileHtml = require('handlebars').compile;


export const logger = {
    logs: [],
    debugLogs: [],

    error: function (msg) {
        logger.logs.push(msg);
    },

    warn: function (msg) {
        logger.logs.push(msg);
    },

    info: function (msg) {
        logger.logs.push(msg);
    },

    pop: function (num) {
        if (arguments.length === 1)
            return logger.logs.splice(logger.logs.length-num);
        else
            return logger.logs.splice(0);
    }
};

//
//  Return an object with a promise and the resolve function for the promise
export function getWaiter () {
    var waiter = {};
    waiter.promise = new Promise(function (resolve) {
        waiter.resolve = resolve;
    });
    return waiter;
}

export function trigger (target, event, process) {
    var e = document.createEvent('HTMLEvents');
    e.initEvent(event, true, true);
    if (process) process(e);
    target.dispatchEvent(e);
}

export function test (name, runAsync) {
    return it(name, testAsync(runAsync));
}

export const nextTick = viewDebounce();

viewProviders.fetch = testFetch;
// comment this line for logs
viewProviders.logger = logger;
// uncomment this line for debug logs
//viewProviders.setDebug();

export default view;


function testAsync (runAsync) {
    return (done) => {
        runAsync().then(done, done.fail);
    };
}


function testFetch (url, ...o) {
    if (isAbsoluteUrl(url)) url = new URL(url).pathname;
    var result = fixtures[url];
    if (result) return promise.ok(result(...o));
    else return promise.error('404 - Not Found');
}

import 'es6-promise';
import {view, viewProviders, viewDebounce} from '../index';
import testFetch from './fixtures/fetch';
import 'd3-transition';

viewProviders.compileTemplate = require('handlebars').compile;
viewProviders.location = {};

export const numDefComponents = view().components.size;


export const logger = {
    logs: [],
    infoLogs: [],

    error: function (msg) {
        logger.logs.push(msg);
    },

    warn: function (msg) {
        logger.logs.push(msg);
    },

    info: function (msg) {
        logger.infoLogs.push(msg);
    },

    pop: function (num) {
        return popLogs(logger.logs, num);
    },

    popInfo: function (num) {
        return popLogs(logger.infoLogs, num);
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
export const sleep = (delay) => viewDebounce(null, delay)();

viewProviders.fetch = testFetch;
// comment this line for logs
viewProviders.logger = logger;
// uncomment this line for debug logs
//viewProviders.setDebug();

export default view;


function testAsync (runAsync) {
    return (done) => {
        let t;
        try {
            t = runAsync();
        } catch (e) {
            done.fail(e);
            return;
        }
        if (t && t.then) t.then(done, done.fail);
        else done();
    };
}


function popLogs (logs, num) {
    if (num !== undefined)
        return logs.splice(logs.length-num);
    else
        return logs.splice(0);
}

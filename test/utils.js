import 'es6-promise';
import {view, viewProviders, viewDebounce} from '../index';
import fixtures from './fixtures/fetch';
import promise from './promise';

window.handlebars = require('handlebars');


export const logger = {
    logs: [],

    warn: function (msg) {
        logger.logs.push(msg);
    },

    pop: function (num) {
        if (arguments.length === 1)
            return logger.logs.splice(logger.logs.length-num);
        else
            return logger.logs.splice(0);
    }
};


export function trigger (target, event, process) {
    var e = document.createEvent('HTMLEvents');
    e.initEvent(event, true, true);
    if (process) process(e);
    target.dispatchEvent(e);
}


export function testAsync (runAsync) {
    return (done) => {
        runAsync().then(done, done.fail);
    };
}

export const nextTick = viewDebounce();


viewProviders.logger = logger;
viewProviders.fetch = testFetch;

export default view;


function testFetch (url) {
    var result = fixtures[url];
    if (result) return promise.ok(result());
    else return promise.error('404 - Not Found');
}

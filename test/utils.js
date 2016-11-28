import 'es6-promise';
import {view, viewProviders} from '../index';


window.handlebars = require('handlebars');


const logger = {
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


viewProviders.logger = logger;


export default view;

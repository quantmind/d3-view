import {View} from '../';


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


View.providers.logger = logger;


export default View;

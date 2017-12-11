var assign = require('object-assign');
var base = require('./karma.base.js');


module.exports = function (config) {

    var options = assign(base, {
        browsers: ['Chrome']
    });

    config.set(options);
};

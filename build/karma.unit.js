var assign = require('object-assign');
var base = require('./karma.base.js');

module.exports = function (config) {

    var options = assign(base, {
        browsers: ['Chrome', 'Firefox'],
        reporters: ['progress']
    });

    if(process.env.TRAVIS || process.env.CIRCLECI) {
        options.browsers = ['ChromeNoSandbox', 'Firefox'];
    }

    config.set(options);
};

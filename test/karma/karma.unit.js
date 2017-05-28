var assign = require('object-assign');
var base = require('./karma.base.js');


module.exports = function (config) {

    var options = assign(base, {
        browsers: ['PhantomJS', 'Chrome', 'Firefox'],
        reporters: ['progress']
    });

    if(process.env.TRAVIS || process.env.CIRCLECI) {
        options.browsers = ['PhantomJS', 'ChromeNoSandbox', 'Firefox'];
    }

    config.set(options);
};

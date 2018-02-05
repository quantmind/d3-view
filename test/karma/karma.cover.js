var assign = require('object-assign');
var base = require('./karma.base.js');


module.exports = function (config) {
    base.browserify.transform[0][1].plugins.push("istanbul");

    var options = assign(base, {
        singleRun: true,

        browsers: ['Chrome'],

        reporters: ['progress', 'coverage'],

        coverageReporter: {
            dir : 'build/coverage/',
            reporters: [
                {
                    type: 'lcov',
                    subdir: '.'
                },
                {
                    type : 'html',
                    subdir: '.'
                },
                {
                    type : 'text',
                    subdir: '.'
                }
            ]
        }
    });

    options.preprocessors['!src/require.js'] = ['coverage'];

    if(process.env.TRAVIS || process.env.CIRCLECI) {
        options.browsers = ['ChromeNoSandbox'];
    }

    config.set(options);
};

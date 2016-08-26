var assign = require('object-assign');
var base = require('./karma.base.js');


module.exports = function (config) {
    var transforms = base.browserify.transform;

    transforms.push(
        [
            'browserify-istanbul',
            {
                instrumenterConfig: {
                    embedSource: true
                }
            }
        ]
    );

    var options = assign(base, {

        browsers: ['PhantomJS'],

        reporters: ['progress', 'coverage'],

        coverageReporter: {
            reporters: [
                { type: 'lcov', dir: '../coverage', subdir: '.' },
                { type: 'text-summary', dir: '../coverage', subdir: '.' },
                { type : 'html', dir : 'coverage/' }
            ]
        },

        browserify: {
            debug: true,
            transform: transforms
        }
    });

    config.set(options);
};

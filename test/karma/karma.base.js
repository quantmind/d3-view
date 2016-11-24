module.exports = {

    phantomjsLauncher: {
        exitOnResourceError: true
    },

    basePath: '../../',
    singleRun: true,
    frameworks: ['jasmine', 'browserify', 'es5-shim'],

    files: [
        './node_modules/babel-polyfill/dist/polyfill.js',
        './test/test-*.js'
    ],

    preprocessors: {
        './test/*.js': ['browserify']
    },

    browserify: {
        debug: true,
        transform: [
            [
                'babelify',
                {
                    presets: ['es2015']
                }
            ]
        ]
    },

    customLaunchers: {
        ChromeNoSandbox: {
            base: 'Chrome',
            flags: ['--no-sandbox']
        }
    }
};

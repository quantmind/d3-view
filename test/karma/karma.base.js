module.exports = {

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
        transform: ['babelify']
    },

    customLaunchers: {
        ChromeNoSandbox: {
            base: 'Chrome',
            flags: ['--no-sandbox']
        }
    }
};

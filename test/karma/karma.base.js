module.exports = {

    basePath: '../../',
    singleRun: true,
    frameworks: ['jasmine', 'browserify'],

    files: [
        './node_modules/babel-polyfill/dist/polyfill.js',
        './test/test-*.js'
    ],

    preprocessors: {
        './node_modules/whatwg-url/lib/*.js': ['browserify'],
        './test/*.js': ['browserify']
    },

    browserify: {
        debug: true,
        transform: [
            ['babelify', {presets: ["env"]}]
        ]
    },

    customLaunchers: {
        ChromeNoSandbox: {
            base: 'Chrome',
            flags: ['--no-sandbox']
        }
    }
};

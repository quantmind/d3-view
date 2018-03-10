module.exports = {

    basePath: '../../',
    singleRun: false,
    frameworks: ['jasmine', 'browserify'],
    reporters: ['spec'],

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
                'babelify', {
                    presets: ["env"],
                    plugins: []
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

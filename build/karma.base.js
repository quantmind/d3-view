module.exports = {

    phantomjsLauncher: {
        exitOnResourceError: true
    },

    basePath: '../../',
    singleRun: true,
    frameworks: ['jasmine', 'browserify', 'es5-shim'],

    files: [
        'js/dist/libs.js',
        'js/tests/test-*.js',
        'js/src/forms/tests/test-*.js'
    ],

    preprocessors: {
        'js/tests/*.js': ['browserify'],
        'js/src/forms/tests/test-*.js': ['browserify']
    },

    browserify: {
        debug: true,
        transform: [
            [
                'babelify',
                {
                    presets: ['es2015']
                }
            ],
            [
                'aliasify',
                {
                    aliases: {'vue': 'vue/dist/vue.js'}
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

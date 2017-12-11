var os = require('os');
var assign = require('object-assign');
var base = require('./karma.base.js');

function browsers (b) {
    if (os.platform() === 'darwin') b.push('Safari');
    return b;
}


module.exports = function (config) {

    var options = assign(base, {
        singleRun: true,
        phantomjsLauncher: {
            exitOnResourceError: true
        },
        browsers: browsers(['Chrome', 'Firefox'])
    });

    if(process.env.TRAVIS || process.env.CIRCLECI) {
        // options.browsers = ['PhantomJS', 'ChromeNoSandbox', 'Firefox'];
        options.browsers = browsers(['ChromeNoSandbox']);
    }

    config.set(options);
};

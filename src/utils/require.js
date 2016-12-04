import {inBrowser} from 'd3-let';


export default function (libs) {
    var promise = new Promise();
    if (inBrowser) {
        window.require(libs, function () {
            promise.resolve.call(arguments);
        });
    }
    else {
        libs = require(libs);
        promise.resolve(libs);
    }
    return promise;
}

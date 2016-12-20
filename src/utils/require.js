import {inBrowser} from 'd3-let';

//
// Promise enabled require function
export default function (libs) {
    var self = this;

    return new Promise(function (resolve, reject) {
        try {
            if (inBrowser) {
                window.require(libs, function () {
                    resolve.apply(this, arguments);
                });
            }
            else {
                resolve.apply(self, require(libs));
            }
        } catch (err) {
            reject(err);
        }
    });
}

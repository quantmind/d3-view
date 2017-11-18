export {requireFrom} from 'd3-require';
import {requireFrom} from 'd3-require';

var isAbsolute = new RegExp('^([a-z]+://|//)'),
    libs = new Map;


function urlIsAbsolute (url) {
    return typeof url === 'string' && isAbsolute.test(url);
}

export var require = requireFrom(function (name) {
    var nameUrl = libs.get(name) || name;
    if (nameUrl.local) return nameUrl.url;
    else if (urlIsAbsolute(nameUrl)) return nameUrl;
    return 'https://unpkg.com/' + nameUrl;
});

require.libs = libs;
require.local = function (name, url) {
    libs.set(name, {
        local: true,
        url: url
    });
};

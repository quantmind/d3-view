//
//  Asynchronous module definitions
import {map} from 'd3-collection';
import {requireFrom} from 'd3-require';

const isAbsolute = new RegExp('^([a-z]+://|//)');

function urlIsAbsolute (url) {
    return typeof url === 'string' && isAbsolute.test(url);
}


export const require = requireFrom(name => {
    var nameUrl = require.libs.get(name) || name;
    if (urlIsAbsolute(nameUrl)) return nameUrl;
    return `https://unpkg.com/${name}`;
});

require.libs = map();

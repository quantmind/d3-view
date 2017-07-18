import {map} from 'd3-collection';

import promise from '../promise';


export default {
    '/test': (o) => {
        if (!o || o.method === 'get')
            return asText('<p>This is a test</p>');
        else
            return notFound();
    },
    '/submitTest': (o) => {
        if (o.method === 'post')
            return asJson(o, {success: true});
        else
            return notFound();
    }
};


function notFound () {
    return {
        status: 404
    };
}

function asText (text) {
    return {
        status: 200,
        headers: map({'content-type': 'text/plain'}),
        text () {
            return promise.ok(text);
        }
    };
}


function asJson (input, data) {
    return {
        input: input,
        status: 200,
        headers: map({'content-type': 'application/json'}),
        json () {
            return promise.ok(data);
        }
    };
}

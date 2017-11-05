import {assign} from 'd3-let';

import providers from './providers';
import warn from './warn';


//
// Form Actions
export default {
    submit: submit
};


const endpointDefauls = {
    contentType: 'application/json',
    method: 'post'
};

//
// Submit action
function submit (e) {
    var submit = this,
        form = submit.form,
        endpoint = assign({}, endpointDefauls, submit.endpoint);

    if (e) {
        e.preventDefault();
        e.stopPropagation();
    }

    var fetch = providers.fetch,
        data = form.$inputData(),
        options = {};

    if (!fetch) {
        warn('fetch provider not available, cannot submit');
        return;
    }

    if (!endpoint.url) {
        warn('No url, cannot submit');
        return;
    }

    if (endpoint.contentType === 'application/json') {
        options.headers = {
            'Content-Type': endpoint.contentType
        };
        options.body = JSON.stringify(data);
    }
    else {
        options.body = new FormData();
        for (var key in data)
            options.body.set(key, data[key]);
    }

    // Flag the form as submitted
    if (!form.$setSubmit()) {
        // form not valid, don't bother with request
        form.$setSubmitDone();
    } else {
        options.method = endpoint.method;
        fetch(endpoint.url, options).then(success, failure);
    }


    function success (response) {
        form.$setSubmitDone();
        var ct = (response.headers.get('content-type') || '').split(';')[0];
        if (ct === 'application/json')
            response.json().then(data => {
                form.$response(data, response.status, response.headers);
            });
        else {
            warn(`Cannot load content type '${ct}'`);
        }
    }

    function failure () {
        form.$setSubmitDone();
    }
}

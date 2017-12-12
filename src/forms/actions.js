import {assign} from 'd3-let';

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
        view = submit.$$view,
        endpoint = assign({}, endpointDefauls, submit.endpoint);

    if (e) {
        e.preventDefault();
        e.stopPropagation();
    }

    var data = form.$inputData(),
        options = {};

    if (!endpoint.url) {
        view.logError('No url, cannot submit');
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
        view.fetch(endpoint.url, options).then(success, failure);
    }


    function success (response) {
        form.$setSubmitDone();
        var ct = (response.headers.get('content-type') || '').split(';')[0];
        if (ct === 'application/json')
            response.json().then(data => {
                form.$response(data, response.status, response.headers);
            });
        else {
            view.logError(`Cannot load content type '${ct}'`);
        }
    }

    function failure () {
        form.$setSubmitDone();
    }
}

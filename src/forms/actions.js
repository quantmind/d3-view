import {assign} from 'd3-let';

//
// Form Actions
export default {
    submit: submit
};

const messages = {
    default: '<strong>Error!</strong> Could not submit form'
};


const endpointDefauls = {
    contentType: 'application/json',
    method: 'POST'
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
        view.logError('No url, cannot submit form');
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
            options.body.append(key, data[key]);
    }

    // Flag the form as submitted
    if (!form.$setSubmit()) {
        // form not valid, don't bother with request
        form.$setSubmitDone();
    } else {
        options.method = endpoint.method;
        view.json(endpoint.url, options).then(done, error);
    }


    function done (response) {
        form.$setSubmitDone();
        form.$response(response);
    }

    function error (err) {
        form.$emit('formMessage', {
            level: 'error',
            message: messages[err.message] || messages.default,
        });
    }
}

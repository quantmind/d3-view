import {isObject} from 'd3-let';

import providers from './providers';
import warn from './warn';


// Form Actions
export default {
    submit: submit
};


function submit (e) {
    var form = this && this.model ? this.model.form : null;

    if (!form) {
        warn('form not available, cannot submit');
        return;
    }

    if (e) {
        e.preventDefault();
        e.stopPropagation();
    }

    var fetch = providers.fetch,
        ct = (form.data.enctype || '').split(';')[0],
        action = form.data.action,
        url = isObject(action) ? action.url : action,
        data = form.inputData(),
        options = {};

    if (!fetch) {
        warn('fetch provider not available, cannot submit');
        return;
    }

    if (!url) {
        warn('No url, cannot submit');
        return;
    }

    if (ct === 'application/json') {
        options.headers = {
            'Content-Type': form.data.enctype
        };
        options.body = JSON.stringify(data);
    }
    else {
        options.body = new FormData();
        for (var key in data)
            options.body.set(key, data[key]);
    }

    // Flag the form as submitted
    form.setSubmit();
    options.method = form.method || 'post';
    fetch(url, options).then(success, failure);


    function success (response) {
        form.setSubmitDone();
        form.response(response);
    }

    function failure () {
        form.setSubmitDone();
    }
}

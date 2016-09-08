import {isObject} from 'd3-let';

import responses from './responses';
import warn from './warn';


// Form Actions
export default {
    submit: submit
};


function submit (e) {

    var form = this.form,
        info = form.structure,
        action = info.action;

    if (!action) {
        warn('No action available, cannot submit form');
        return;
    }

    e.preventDefault();
    e.stopPropagation();

    if (!this.$resource) {
        warn('No $resource method available, cannot submit form');
        return;
    }

    // Flag the form as submitted
    // info.setSubmited();

    var ct = (info.enctype || '').split(';')[0],
        method = info.method || 'post',
        options = {data: form.model};

    if (ct === 'application/x-www-form-urlencoded' || ct === 'multipart/form-data')
        options.headers = {
            'content-type': undefined
        };

    options.method = method;
    options.url = isObject(action) ? action.url : action;

    form.$pending = true;
    this.$resource(options).then(success, failure);


    function success (response) {
        form.$pending = false;
        var hook = responses[info.resultHandler];
        hook(response, info);
    }

    function failure (response) {
        form.$pending = false;
        var data = response.data || {},
            errors = data.errors;

        if (!errors) {
            errors = data.message;
            if (!errors) {
                var status = response.status || data.status || 501;
                errors = 'Response error (' + status + ')';
            }
        }
        form.$addMessages(errors, 'error');
    }
}

import {isString} from 'd3-let';

import fieldset from './field-set';
import input from './field-input';
import textarea from './field-textarea';
import submit from './field-submit';
import responses from './responses';
import warn from './warn';
import providers from './providers';
import {addChildren, modelData} from './utils';


// Main form component
export default {

    // make sure a new model is created for this component
    props: ['json'],

    model: {
        formSubmitted: false,
        formPending: false
    },

    components: {
        'd3fieldset': fieldset,
        'd3input': input,
        'd3textarea': textarea,
        'd3submit': submit
    },

    render: function (data) {
        var model = this.model,
            form = this.createElement('form').attr('novalidate', ''),
            self = this;
        //
        model.inputs = {};
        model.form = this;
        //
        var json = data['json'];
        if (isString(json)) {
            var fetch = providers.fetch;
            fetch(json, {method: 'GET'}).then((response) => {
                if (response.status === 200) response.json().then(build);
                else warn(`Could not load form from ${json}: status ${response.status}`);
            });
        }
        else build(json);

        return form;


        function build (formData) {
            modelData.call(self, formData);
            addChildren.call(self, form);
        }
    },

    inputData: function () {
        var inputs = this.model.inputs,
            data = {},
            value;
        for (var key in inputs) {
            value = inputs[key].model.value;
            if (value !== undefined) data[key] = value;
        }

        return data;
    },

    setSubmit: function () {
        this.model.formSubmitted = true;
        this.model.formPending = true;
    },

    setSubmitDone: function () {
        this.model.formPending = false;
    },

    response: function (response) {
        if (response.status < 300) {
            if (this.data.resultHandler) {
                var handler = responses[this.data.resultHandler];
                if (!handler) warn(`Could not find ${this.data.resultHandler} result handler`);
                else handler.call(this, response);
            } else {
                responses.default.call(this, response);
            }
        } else
            this.responseError(response);
    }
};

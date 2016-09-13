import fieldset from './field-set';
import input from './field-input';
import textarea from './field-textarea';
import submit from './field-submit';
import responses from './responses';
import warn from './warn';
import {addChildren, modelData} from './utils';

// Main form component
export default {

    // make sure a new model is created for this component
    props: ['json', 'url'],

    components: {
        'd3fieldset': fieldset,
        'd3input': input,
        'd3textarea': textarea,
        'd3submit': submit
    },

    render: function (data) {
        var model = this.model,
            form = this.createElement('form').attr('novalidate', '');

        modelData.call(this, data['json']);
        //
        // set reactive properties
        model.$set('formSubmitted', false);
        model.$set('formPending', false);
        //
        model.inputs = {};
        model.form = this;
        //
        this.isDirty = false;
        //
        addChildren.call(this, form);
        return form;
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

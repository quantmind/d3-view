import {isString, isArray} from 'd3-let';

import fieldset from './field-set';
import input from './field-input';
import textarea from './field-textarea';
import select from './field-select';
import submit from './field-submit';
import responses from './responses';
import warn from './warn';
import providers from './providers';
import actions from './actions';
import validators from './validators';
import {addChildren, modelData, nextTick} from './utils';


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
        'd3select': select,
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
            return fetch(json, {method: 'GET'}).then((response) => {
                if (response.status === 200) return response.json().then(build);
                else warn(`Could not load form from ${json}: status ${response.status}`);
            });
        }
        else return build(json);

        function build (formData) {
            modelData.call(self, formData);
            //
            // Form validations
            model.validators = validators.get(model, data.validators);
            //
            // Form actions
            self.actions = {};
            for (var key in actions) {
                var action = self.data[key];
                if (isString(action)) action = self.model.$get(action);
                self.actions[key] = action || actions[key];
            }
            addChildren.call(self, form);
            return form;
        }
    },

    inputData: function () {
        var inputs = this.model.inputs,
            data = {},
            value;
        for (var key in inputs) {
            value = inputs[key].value;
            if (value !== undefined) data[key] = value;
        }

        return data;
    },

    setSubmit: function () {
        this.model.formSubmitted = true;
        this.model.formPending = true;
        return nextTick.call(this, () => {
            return this.isValid();
        });
    },

    setSubmitDone: function () {
        this.model.formPending = false;
    },

    isValid () {
        var inp;
        for (var key in this.model.inputs) {
            inp = this.model.inputs[key];
            if (inp.error) return false;
        }
        return true;
    },

    inputError (error) {
        var input = this.model.inputs[error.name];
        if (!input) {
            warn('Unknown input, cannot set input error');
            this.error(error);
        }
    },

    response (response) {
        if (!response) return;
        var handler;

        if (response.status) {
            if (response.status < 300) {
                if (this.data.resultHandler) {
                    handler = responses[this.data.resultHandler];
                    if (!handler) warn(`Could not find ${this.data.resultHandler} result handler`);
                    else handler.call(this, response);
                } else {
                    responses.default.call(this, response);
                }
            } else
                this.responseError(response);
        }
        else if (response.error) {
            this.error(response.error);
        } else if (isArray(response.errors)) {
            var self = this;
            response.errors.forEach((error) => {
                self.inputError(error);
            });
        }
        else {
            if (this.data.resultHandler) {
                handler = responses[this.data.resultHandler];
                if (!handler) warn(`Could not find ${this.data.resultHandler} result handler`);
                else handler.call(this, response);
            } else {
                responses.default.call(this, response);
            }
        }
    }
};

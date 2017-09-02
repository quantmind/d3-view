import {isString} from 'd3-let';

import {formElement} from './field';
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
import {addChildren} from './utils';


// Main form component
export default {

    // make sure a new model is created for this component
    props: ['schema'],

    components: {
        'd3-form-fieldset': fieldset,
        'd3-form-input': input,
        'd3-form-textarea': textarea,
        'd3-form-select': select,
        'd3-form-submit': submit
    },

    model: {
        formSubmitted: false,
        formPending: false,
        $isValid (submitting) {
            let inp,
                valid = true;
            for (var key in this.inputs) {
                inp = this.inputs[key];
                if (submitting) inp.isDirty = true;
                inp.$validate();
                if (inp.error) valid = false;
            }
            return valid;
        },
        $setSubmit () {
            this.formSubmitted = true;
            this.formPending = true;
            return this.$isValid(true);
        },
        $setSubmitDone () {
            this.formPending = false;
        },
        $inputData () {
            var inputs = this.inputs,
                data = {},
                value;
            for (var key in inputs) {
                value = inputs[key].value;
                if (value || input.changed) data[key] = value;
            }
            return data;
        },
        //
        // response from a server submit
        $response (data, status, headers) {
            if (status < 300) {
                if (this.data.resultHandler) {
                    var handler = responses[this.data.resultHandler];
                    if (!handler) warn(`Could not find ${this.data.resultHandler} result handler`);
                    else handler.call(this, data, status, headers);
                } else {
                    responses.default.call(this, data, status, headers);
                }
            } else
                this.$responseError(data, status, headers);
        },
        //
        //  bad response from server submit
        $responseError (data) {
            data.level = 'error';
            this.$message(data);
        }
    },

    render: function (data) {
        var model = this.model,
            form = this.createElement('form').attr('novalidate', ''),
            self = this;
        //
        model.$formExtensions = this.root.$formExtensions || [];
        model.inputs = {};
        model.actions = {};
        model.form = model; // inject self for children models
        //
        var schema = data['schema'];
        if (isString(schema)) {
            var fetch = providers.fetch;
            return fetch(schema, {method: 'GET'}).then((response) => {
                if (response.status === 200) return response.json().then(build);
                else warn(`Could not load form from ${schema}: status ${response.status}`);
            });
        }
        else return build(schema);

        function build (schema) {
            schema = formElement.inputData.call(self, form, schema);
            //
            // Form validations
            model.validators = validators.get(schema.validators);
            //
            // Form actions
            for (var key in actions) {
                var action = schema[key];
                if (isString(action)) action = self.model.$get(action);
                model.actions[key] = action || actions[key];
            }
            addChildren.call(self, form);
            return form;
        }
    }
};

import {isString} from 'd3-let';

import {formElement} from './field';
import fieldset from './field-set';
import input from './field-input';
import textarea from './field-textarea';
import select from './field-select';
import submit from './field-submit';
import responses from './responses';
import actions from './actions';
import validators from './validators';
import {addChildren} from './utils';


// Main form component
export default {

    // Allow to specify form schema and initial values
    props: ['schema', 'values'],

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
        $response (response) {
            if (response.data) {
                if (this.data.resultHandler) {
                    var handler = responses[this.data.resultHandler];
                    if (!handler) this.$$view.logError(`Could not find ${this.data.resultHandler} result handler`);
                    else handler.call(this, response);
                } else {
                    responses.default.call(this, response);
                }
            } else
                this.$responseError(response);
        },
        //
        //  bad response from server submit
        $responseError (response) {
            this.$emit('message', {
                level: 'error',
                msg: response.description || response.status,
                response: response
            });
        }
    },

    render (data) {
        var model = this.model,
            form = this.createElement('form').attr('novalidate', ''),
            self = this;
        //
        model.$formExtensions = this.root.$formExtensions || [];
        model.inputs = {};
        model.actions = {};
        model.form = model; // inject self for children models
        //
        var schema = data.schema;
        if (data.values) schema.values = data.values;
        if (isString(schema))
            return this.json(schema).then(build);
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
    },

    childrenMounted () {
        var model = this.model,
            values = model.data.values;

        if (values) Object.keys(values).forEach(key => {
            var inp = model.inputs[key];
            if (inp) inp.value = values[key];
        });
    }
};

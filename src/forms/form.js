import {isString, assign} from 'd3-let';

import {formElement} from './field';
import fieldset from './field-set';
import input from './field-input';
import textarea from './field-textarea';
import select from './field-select';
import submit from './field-submit';
import responses from './responses';
import actions from './actions';


// Main form component
export default assign({}, formElement, {

    // Allow to specify and initial values
    props: ['url', 'values', 'form'],

    components: {
        'd3-form-fieldset': fieldset,
        'd3-form-input': input,
        'd3-form-textarea': textarea,
        'd3-form-select': select,
        'd3-form-submit': submit
    },

    model: {
        form: null,     //  parent form
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
            this.$emit('formMessage', {
                level: 'error',
                data: response.data,
                response: response
            });
        }
    },

    render () {
        if (this.props.url)
            return this.json(this.props.url).then(response => this.build(response.data));
        else return this.build();
    },

    childrenMounted () {
        var model = this.model,
            values = model.data.values;

        if (values) Object.keys(values).forEach(key => {
            var inp = model.inputs[key];
            if (inp) inp.value = values[key];
        });
    },

    build (props) {
        if (props) this.props = assign(this.props, props);
        const form = this.init(this.createElement('form').attr('novalidate', '')),
            model = this.model;
        //
        model.$formExtensions = this.root.$formExtensions || [];
        model.inputs = {};
        model.actions = {};
        //
        // Form actions
        for (var key in actions) {
            var action = this.props[key];
            if (isString(action)) action = this.model.$get(action);
            model.actions[key] = action || actions[key];
        }
        return this.addChildren(form, model);
    }
});

import {event} from 'd3-selection';
import {isString, assign} from 'd3-let';

import {formElement} from './field';

//
// Submit element
export default assign({}, formElement, {

    render: function (data) {
        var tag = data ? data.tag || 'button' : 'button',
            el = this.createElement(tag);

        data = this.inputData(el, data);
        var model = this.model;
        //
        // model non-reactive attributes
        model.type = data.type || 'submit';
        if (data.endpoint) model.endpoint = data.endpoint;
        //
        // default submit function
        model.$submit = () => {
            model.actions.submit.call(model, event);
        };

        if (!isString(data.disabled)) {
            this.model.$set('disabled', data.disabled || null);
            data.disabled = 'disabled';
        }
        if (!data.submit) data.submit = '$submit()';

        el.attr('type', model.type)
            .attr('name', model.name)
            .attr('d3-attr-disabled', data.disabled)
            .attr('d3-on-click', data.submit)
            .html(data.label || 'submit');

        return this.wrap(el);
    }
});

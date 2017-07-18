import assign from 'object-assign';
import {event} from 'd3-selection';
import {isString} from 'd3-let';

import {formElement} from './field';
import {modelData} from './utils';

//
// Submit element
export default assign({

    render: function (data) {
        var model = this.model;
        data = modelData.call(this, data);
        model.$set('error', false);
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

        var el = this.createElement(data.tag || 'button')
                .attr('type', model.type)
                .attr('name', model.name)
                .attr('d3-attr-disabled', data.disabled)
                .attr('d3-on-click', data.submit)
                .html(data.label || 'submit');

        return this.wrap(el);
    }
}, formElement);

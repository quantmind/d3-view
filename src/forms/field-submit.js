import {event} from 'd3-selection';
import {isString, assign} from 'd3-let';

import {formElement} from './field';
import {modelData} from './utils';

//
// Submit element
export default assign({

    render: function (data) {
        data = modelData.call(this, data);
        data.type = data.type || 'submit';
        this.model.$set('error', false);
        if (!isString(data.disabled)) {
            this.model.$set('disabled', data.disabled || null);
            data.disabled = 'disabled';
        }
        if (!data.click) data.click = '$vm.click()';

        var el = this.createElement('button')
                .attr('type', data.type)
                .attr('name', data.name)
                .attr('d3-attr-disabled', data.disabled)
                .attr('d3-on-click', data.click)
                .html(data.label || 'submit');

        return this.wrap(el);
    },

    click: function () {
        this.model.actions.submit.call(this, event);
    }
}, formElement);

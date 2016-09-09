import {isString, assign} from 'd3-let';

import field from './field';
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

        var field = this,
            el = this.createElement('button')
                .attr('type', data.type)
                .attr('name', data.name)
                .attr('d3-attr-disabled', data.disabled)
                .html(data.label || 'submit')
                .on('click', () => {
                    field.click();
                });

        return this.wrap(el);
    },

    click: function () {

    }
}, field);

import assign from 'object-assign';

import field from './field';
import validators from './validators';

//
// Textarea element
export default assign({

    render: function (data) {
        data = this.inputData(data);
        var el = this.createElement('textarea')
                .attr('id', data.id)
                .attr('name', data.name)
                .attr('placeholder', data.placeholder)
                .attr('d3-value', 'value')
                .attr('d3-validate', 'validators');

        validators.set(this, el);
        return this.wrap(el);
    }

}, field);

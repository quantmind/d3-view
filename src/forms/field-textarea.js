import assign from 'object-assign';

import field from './field';
import validators from './validators';

//
// Textarea element
export default assign({}, field, {

    render: function (data) {
        data = this.inputData(data);
        var el = this.createElement('textarea')
                .attr('id', data.id)
                .attr('name', data.name)
                .attr('placeholder', data.placeholder)
                .attr('d3-value', 'value');

        validators.set(this, el);
        return this.wrap(el);
    }

});

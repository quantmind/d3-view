import {assign} from 'd3-let';

import field from './field';


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

        this.model.inputs[data.name] = this;
        return this.wrap(el);
    }

}, field);

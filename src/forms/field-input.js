import {assign} from 'd3-let';

import field from './field';
import validators from './validators';

//
// Input element
export default assign({

    render (data) {
        data = this.inputData(data);
        var el = this.createElement('input')
                .attr('id', data.id)
                .attr('type', data.type || 'text')
                .attr('name', data.name)
                .attr('d3-value', 'value')
                .attr('placeholder', data.placeholder);

        validators.set(this, el);
        return this.wrap(el);
    }
}, field);

import {assign} from 'd3-let';

import field from './field';
import validators from './validators';

//
// Textarea element
export default assign({}, field, {

    render () {
        var el = this.createElement('textarea'),
            data = this.inputData(el, this.props);
        el.attr('placeholder', data.placeholder)
            .attr('d3-value', 'value');

        validators.set(this, el);
        return this.wrap(el);
    }

});

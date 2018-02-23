import {assign} from 'd3-let';

import field from './field';
import validators from './validators';


const checks = ['checkbox', 'radio'];

//
// Input element
export default assign({}, field, {

    render () {
        const el = this.createElement('input'),
            data = this.inputData(el, this.props);

        el.attr('type', data.type || 'text')
            .attr('d3-value', 'value');

        if (checks.indexOf(el.attr('type')) === -1)
            el.attr('placeholder', data.placeholder);

        validators.set(this, el);
        return this.wrap(el);
    }
});

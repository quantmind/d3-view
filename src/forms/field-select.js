import {isArray, assign} from 'd3-let';

import field from './field';
import validators from './validators';

//
// Select element
export default assign({}, field, {

    model: assign({
        options: [],
        $optionLabel: optionLabel,
        $optionValue: optionValue
    }, field.model),

    render: function (data) {
        data = this.inputData(data);
        var el = this.createElement('select')
                .attr('id', data.id)
                .attr('name', data.name)
                .attr('d3-value', 'value')
                .attr('placeholder', data.placeholder);

        this.model.options = data.options;

        el.append('option')
            .attr('d3-for', 'option in options')
            .attr('d3-html', '$optionLabel()')
            .attr('d3-attr-value', '$optionValue()');

        validators.set(this, el);
        return this.wrap(el);
    }
});


function optionValue () {
    if (isArray(this.option)) return this.option[0];
    return this.option;
}


function optionLabel () {
    if (isArray(this.option)) return this.option[1] || this.option[0];
    return this.option;
}

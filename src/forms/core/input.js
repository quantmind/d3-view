import {isObject} from 'd3-let';
import formElement from './element';

const VALIDATORS = ['required', 'minlength', 'maxlength', 'min', 'max'];


//
// Input element
export default {

    mixins: [formElement],

    render: function () {
        var model = this.model,
            el = this.createElement('input')
                .attr('id', model.id)
                .attr('type', model.type || 'text')
                .attr('name', model.name)
                .attr('d3-value', `formData.${model.name}`)
                .attr('d3-validate', 'validators');
        model.placeholder = model.placeholder || model.label || model.name;
        return el;
    },

    refresh: function () {
        var model = this.model;
        this.el.attr('placeholder', model.placeholder);
    }
};


export function validators (structure) {
    let validators = {};
    if (isObject(structure))
        Object.keys(structure).forEach((key) => {
            if (VALIDATORS.indexOf(key) > -1)
                validators[key] = structure[key];
        });
    return validators;
}

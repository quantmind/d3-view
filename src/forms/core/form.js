import formElement from './element';
import fieldset from './fieldset';
import input from './input';
import submit from './submit';
import {addChildren} from './utils';


const components = {
    'form-fieldset': fieldset,
    'form-input': input,
    'form-submit': submit
};


export default class extends formElement {

    static get components () {
        return components;
    }

    get isForm () {
        return true;
    }

    render () {
        var form = this.createElement('form')
            .attr('novalidate', '');

        return addChildren(form);
    }
}

import formElement from './element';
import fieldset from './fieldset';
import input from './input';
import submit from './submit';


const components = {
    'd3fieldset': fieldset,
    'd3input': input,
    'd3submit': submit
};


const formProps = ['json', 'url'];


export default class extends formElement {

    // make sure a new model is created for this component
    static get props () {
        return formProps;
    }

    static get components () {
        return components;
    }

    get isForm () {
        return true;
    }

    render () {
        var model = this.model,
            form = this.createElement('form')
            .attr('novalidate', '');

        model.structure = {};
        return this.addChildren(form);
    }
}

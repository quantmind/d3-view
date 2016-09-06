import formElement from './element';

//
// Fieldset element
export default class extends formElement {

    render () {
        var el = this.createElement('fieldset');
        return this.addChildren(el);
    }

}

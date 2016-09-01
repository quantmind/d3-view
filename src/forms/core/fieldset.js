import formElement from './element';
import {addChildren} from './utils';

//
// Fieldset element
export default class extends formElement {

    render () {
        var el = this.createElement('fieldset');
        return addChildren(el);
    }

}

import {assign} from 'd3-let';

import {formElement} from './field';
import {addChildren} from './utils';

//
// Fieldset element
export default assign({}, formElement, {

    render () {
        const tag = this.props.tag || 'fieldset',
            el = this.createElement(tag);
        this.inputData(el, this.props);
        return addChildren.call(this, el);
    }

});

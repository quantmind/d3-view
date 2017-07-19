import assign from 'object-assign';

import {formElement} from './field';
import {addChildren} from './utils';

//
// Fieldset element
export default assign({}, formElement, {

    render (data) {
        var tag = data ? data.tag || 'fieldset' : 'fieldset',
            el = this.createElement(tag);
        data = this.inputData(el, data);
        return addChildren.call(this, el);
    }

});

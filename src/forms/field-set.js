import {assign} from 'd3-let';

import {formElement} from './field';

//
// Fieldset element
export default assign({}, formElement, {

    render () {
        const tag = this.props.tag || 'fieldset',
            el = this.createElement(tag);
        this.inputData(el, this.props);
        return this.addChildren(el);
    }

});

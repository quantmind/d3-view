import {addChildren} from './utils';

//
// Fieldset element
export default {

    render: function () {
        var el = this.createElement('fieldset');
        return addChildren.call(this, el);
    }

};

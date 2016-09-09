import {addChildren, modelData} from './utils';

//
// Fieldset element
export default {

    render: function (data) {
        var el = this.createElement('fieldset');
        modelData.call(this, data);
        return addChildren.call(this, el);
    }

};

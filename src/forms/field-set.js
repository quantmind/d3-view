import {addChildren, modelData} from './utils';

//
// Fieldset element
export default {

    render (data) {
        var tag = data.tag || 'fieldset';
        var el = this.createElement(tag);
        modelData.call(this, data);
        if (data.classes) el.classed(data.classes, true);
        return addChildren.call(this, el);
    }

};

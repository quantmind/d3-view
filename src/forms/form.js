import fieldset from './field-set';
import input from './field-input';
import textarea from './field-textarea';
import submit from './field-submit';
import {addChildren} from './utils';


export default {

    // make sure a new model is created for this component
    props: ['json', 'url'],

    components: {
        'd3fieldset': fieldset,
        'd3input': input,
        'd3textarea': textarea,
        'd3submit': submit
    },

    render: function (props) {
        var model = this.model,
            form = this.createElement('form')
            .attr('novalidate', '');

        // Set reactive formData object
        model.$set('formData', {});
        model.structure = props['json'] || {};
        addChildren.call(this, form);
        return form;
    }
};

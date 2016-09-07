import fieldset from './fieldset';
import input from './input';
import submit from './submit';
import {addChildren} from './utils';


export default {

    // make sure a new model is created for this component
    props: ['json', 'url'],

    components: {
        'd3fieldset': fieldset,
        'd3input': input,
        'd3submit': submit
    },

    render: function () {
        var model = this.model,
            form = this.createElement('form')
            .attr('novalidate', '');

        model.structure = {};
        addChildren.call(this, form);
    }
};

import {event} from 'd3-selection';
import {assign} from 'd3-let';

import {formElement} from './field';

//
// Submit element
export default assign({}, formElement, {

    render () {
        const tag = this.props.tag || 'button',
            el = this.createElement(tag),
            data = this.inputData(el, this.props),
            model = this.model;
        //
        // model non-reactive attributes
        model.type = data.type || 'submit';
        if (data.endpoint) model.endpoint = data.endpoint;
        //
        // default submit function
        model.$submit = () => {
            if (event && event.defaultPrevented) return;
            model.actions.submit.call(model, event);
        };
        if (!data.submit) data.submit = '$submit()';

        el.attr('type', model.type)
            .attr('name', model.name)
            .attr('d3-on-click', data.submit)
            .html(data.label || 'submit');

        return this.wrap(el);
    }
});

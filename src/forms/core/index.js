import form from './form';
import element from './element';
import actions from './actions';
import responses from './responses';
import wrapper from './wrappers';


export const viewForms = {

    install: function (view) {
        view.components.set('d3form', form);
    },

    actions: actions,

    responses: responses,

    element: element,

    wrapper: wrapper
};

import form from './form';
import actions from './actions';
import responses from './responses';
import wrapper from './wrappers';


export default {

    install: function (view) {
        view.addComponent('d3form', form);
    },

    actions: actions,

    responses: responses,

    wrapper: wrapper
};

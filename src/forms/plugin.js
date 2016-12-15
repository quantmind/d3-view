import form from './form';
import actions from './actions';
import responses from './responses';
import providers from './providers';


// Forms plugin
export default {

    install: function (view) {
        view.addComponent('d3form', form);
        for (var key in view.providers)
            providers[key] = view.providers[key];
    },

    actions: actions,

    responses: responses
};

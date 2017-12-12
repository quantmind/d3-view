import form from './form';
import actions from './actions';
import responses from './responses';


// Forms plugin
export default {
    install (vm) {
        vm.addComponent('d3form', form);
        // list of form Extensions
        vm.$formExtensions = [];
    },
    actions,
    responses
};

import form from './form';
import actions from './actions';
import responses from './responses';
import providers from './providers';


// Forms plugin
export default {
    install (vm) {
        vm.addComponent('d3form', form);
        // list of form Extensions
        vm.$formExtensions = [];
        for (var key in vm.providers)
            providers[key] = vm.providers[key];
    },
    actions,
    responses
};

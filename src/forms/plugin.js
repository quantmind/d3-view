import form from './form';
import actions from './actions';
import responses from './responses';
import validators from './validators';


// Forms plugin
export default {
    install (vm) {
        vm.addComponent('d3form', form);
        // list of form Extensions
        vm.$formExtensions = [];
    },
    actions,
    responses,
    validators
};

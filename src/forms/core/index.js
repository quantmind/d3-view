import form from './form';
import element from './element';
import actions from './actions';
import responses from './responses';
import {wrapper} from './wrappers';


export default {

    install: function (vm) {
        if (vm.isMounted()) return vm.warn('View model already mounted, cannot add form plugin');
        vm.components.set('d3-form', form);
    },

    actions: actions,

    responses: responses,

    element: element,

    wrapper: wrapper
};

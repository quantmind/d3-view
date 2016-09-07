import view from './utils';
import {isObject, isFunction} from 'd3-let';
import {viewForms, viewElement} from '../';


describe('view meta', function() {

    it('viewForms', () => {
        expect(isObject(viewForms)).toBe(true);
        expect(isFunction(viewForms.install)).toBe(true);
    });

    it('test install', function () {
        var vm = view().use(viewForms);
        expect(vm.components.get('d3form')).toBeTruthy();
    });

    it('test mount empty form', function () {
        var vm = view().use(viewForms);
        vm.mount(viewElement('<div><d3form></d3form></div>'));
    });
});

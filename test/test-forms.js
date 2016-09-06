import view from './utils';
import {isObject, isFunction} from 'd3-let';
import {viewForms} from '../src/forms/core';


describe('view meta', function() {

    it('viewForms', () => {
        expect(isObject(viewForms)).toBe(true);
        expect(isFunction(viewForms.install)).toBe(true);
    });

    it('test install', function () {
        var vm = view({
            el: view.htmlElement('<div><d3form></d3form></div>')
        }).use(viewForms);
        expect(vm.components.get('d3form')).toBeTruthy();
    });

    it('test mount empty form', function () {
        var vm = view({
            el: view.htmlElement('<div><d3form></d3form></div>')
        }).use(viewForms);
        vm.mount();
    });
});

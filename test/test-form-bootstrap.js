import {isObject, isFunction, isArray} from 'd3-let';

import view from './utils';
import {viewForms, viewElement, viewBootstrapForms} from '../index';
import jsonform from './fixtures/jsonform';


describe('Bootstrap plugin', () => {

    let el;

    beforeEach(() => {
        el = viewElement(`<div><d3form schema='${jsonform}'></d3form></div>`);
    });

    it('viewBootstrapForms', () => {
        expect(isObject(viewBootstrapForms)).toBe(true);
        expect(isFunction(viewBootstrapForms.install)).toBe(true);
    });

    it('test install', () => {
        var vm = view().use(viewForms).use(viewBootstrapForms);
        expect(isArray(vm.$formExtensions)).toBe(true);
        expect(vm.$formExtensions.length).toBe(1);
    });

    it('mount empty form', () => {
        var vm = view().use(viewForms).use(viewBootstrapForms);
        vm.mount(viewElement('<div><d3form></d3form></div>'));
    });

    it ('form model', () => {
        var vm = view().use(viewForms).use(viewBootstrapForms);
        vm.mount(el);
        var fv = vm.sel.select('form').view();
        var model = fv.model;
        expect(isObject(model.inputs)).toBe(true);
        expect(isObject(model.actions)).toBe(true);
        expect(model.formSubmitted).toBe(false);
        expect(model.formPending).toBe(false);
    });

    it ('Dynamic mount', () => {
        var vm = view().use(viewForms).use(viewBootstrapForms);
        vm.mount(viewElement('<div>/<div>'));
        //
        vm.sel.html('<d3form></d3form').mount({schema: JSON.parse(jsonform)});
        var fv = vm.sel.select('form').view(),
            model = fv.model;

        expect(model.inputs.id).toBeTruthy();
        expect(model.inputs.token).toBeTruthy();
    });

    it ('Small form', () => {
        var vm = view().use(viewForms).use(viewBootstrapForms),
            schema = JSON.parse(jsonform);
        schema.size = 'sm';
        vm.mount(viewElement('<div>/<div>'));
        //
        vm.sel.html('<d3form></d3form').mount({schema: schema});
        var inputs = vm.sel.select('form').selectAll('.form-control-sm');
        expect(inputs.size()).toBe(2);
    });

});

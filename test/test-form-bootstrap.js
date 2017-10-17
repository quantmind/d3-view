import {isObject, isFunction, isArray} from 'd3-let';

import view, {test} from './utils';
import {viewForms, viewElement, viewBootstrapForms} from '../index';
import jsonform from './fixtures/jsonform';


describe('Bootstrap plugin -', () => {

    let el;

    beforeEach(() => {
        el = viewElement(`<div><d3form schema='${jsonform}'></d3form></div>`);
    });

    it('viewBootstrapForms', () => {
        expect(isObject(viewBootstrapForms)).toBe(true);
        expect(isFunction(viewBootstrapForms.install)).toBe(true);
    });

    it('install', () => {
        var vm = view().use(viewForms).use(viewBootstrapForms);
        expect(isArray(vm.$formExtensions)).toBe(true);
        expect(vm.$formExtensions.length).toBe(1);
    });

    test('mount empty form', async () => {
        var vm = view().use(viewForms).use(viewBootstrapForms);
        await vm.mount(viewElement('<div><d3form></d3form></div>'));
    });

    test('form model', async () => {
        var vm = view().use(viewForms).use(viewBootstrapForms);
        await vm.mount(el);
        var fv = vm.sel.select('form').view();
        var model = fv.model;
        expect(isObject(model.inputs)).toBe(true);
        expect(isObject(model.actions)).toBe(true);
        expect(model.formSubmitted).toBe(false);
        expect(model.formPending).toBe(false);
    });

    test('dynamic mount', async () => {
        var vm = view().use(viewForms).use(viewBootstrapForms);
        await vm.mount(vm.viewElement('<div>/<div>'));
        //
        await vm.sel.html('<d3form></d3form').mount({schema: JSON.parse(jsonform)});
        var fv = vm.sel.select('form').view(),
            model = fv.model;

        expect(model.inputs.id).toBeTruthy();
        expect(model.inputs.token).toBeTruthy();
    });

    test('small form', async () => {
        var vm = view().use(viewForms).use(viewBootstrapForms),
            schema = JSON.parse(jsonform);
        schema.size = 'sm';
        await vm.mount(viewElement('<div>/<div>'));
        //
        await vm.sel.html('<d3form></d3form').mount({schema: schema});
        var inputs = vm.sel.select('form').selectAll('.form-control-sm');
        expect(inputs.size()).toBe(2);
        inputs = vm.sel.select('form').selectAll('.form-control');
        expect(inputs.size()).toBe(2);
    });

});

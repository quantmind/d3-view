import {isObject, isFunction} from 'd3-let';

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
        expect(vm.components.get('d3form')).toBeTruthy();
        var theme = vm.components.get('d3form').prototype.formTheme;
        expect(isObject(theme)).toBe(true);
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

});

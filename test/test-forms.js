import {isObject, isFunction, isArray} from 'd3-let';

import view, {testAsync} from './utils';
import {viewForms, viewElement, viewDebounce} from '../index';
import jsonform from './fixtures/jsonform';


const nextTick = viewDebounce();


describe('view meta', () => {

    it('viewForms', () => {
        expect(isObject(viewForms)).toBe(true);
        expect(isFunction(viewForms.install)).toBe(true);
    });

    it('test install', () => {
        var vm = view().use(viewForms);
        expect(vm.components.get('d3form')).toBeTruthy();
    });

    it('mount empty form', () => {
        var vm = view().use(viewForms);
        vm.mount(viewElement('<div><d3form></d3form></div>'));
    });
});


describe('json form', () => {

    let el;

    beforeEach(() => {
        el = viewElement(`<div><d3form schema='${jsonform}'></d3form></div>`);
    });

    it ('form model', () => {
        var vm = view().use(viewForms);
        vm.mount(el);
        var fv = vm.sel.select('form').view();
        var model = fv.model;
        expect(isObject(model.inputs)).toBe(true);
        expect(isArray(model.validators)).toBe(true);
        expect(isObject(model.actions)).toBe(true);
        expect(model.formSubmitted).toBe(false);
        expect(model.formPending).toBe(false);
    });

    it ('maxLength - minLength validation', testAsync(async () => {
        var vm = view().use(viewForms);
        vm.mount(el);
        var fv = vm.sel.select('form').view();
        var model = fv.model;

        await nextTick();

        var token = model.inputs.token;
        token.value = 'xxy';
        expect(token.isDirty).toBe(false);
        expect(token.error).toBe('required');
        expect(token.showError).toBe(false);

        await nextTick();
        expect(token.isDirty).toBe(true);
        expect(token.error).toBe('too short - 8 characters or more expected');
        expect(token.showError).toBe(true);

        token.value = 'xxyabcabc';
        await nextTick();
        expect(token.isDirty).toBe(true);
        expect(token.error).toBe('');
        expect(token.showError).toBe(false);
    }));

    it ('test children errors', testAsync(async () => {
        var vm = view().use(viewForms);
        vm.mount(el);

        var form = vm.sel.select('form');

        expect(form.node()).toBeTruthy();
        var fv = form.view();
        expect(fv.parent).toBe(vm);
        var formModel = fv.model;
        expect(Object.keys(formModel.inputs).length).toBe(2);
        var id = formModel.inputs['id'];
        var token = formModel.inputs['token'];
        expect(id).toBeTruthy();
        expect(token).toBeTruthy();

        expect(id.showError).toBe(false);
        expect(token.showError).toBe(false);

        await nextTick();

        expect(id.showError).toBe(false);
        expect(id.isDirty).toBe(false);
        expect(token.showError).toBe(false);
        expect(token.isDirty).toBe(false);

        var valid = formModel.$setSubmit();

        expect(valid).toBe(false);

        expect(formModel.formSubmitted).toBe(true);

        await nextTick();

        expect(id.showError).toBe(true);
        expect(token.showError).toBe(true);
    }));
});

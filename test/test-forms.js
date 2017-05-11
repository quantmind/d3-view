import {isObject, isFunction} from 'd3-let';
import {timeout} from 'd3-timer';

import view from './utils';
import {viewForms, viewElement} from '../index';
import jsonform from './fixtures/jsonform';


describe('view meta', function() {

    it('viewForms', () => {
        expect(isObject(viewForms)).toBe(true);
        expect(isFunction(viewForms.install)).toBe(true);
    });

    it('test install', function () {
        var vm = view().use(viewForms);
        expect(vm.components.get('d3form')).toBeTruthy();
    });

    it('mount empty form', function () {
        var vm = view().use(viewForms);
        vm.mount(viewElement('<div><d3form></d3form></div>'));
    });
});


describe('json form', function () {

    let el;

    beforeEach(() => {
        el = viewElement(`<div><d3form json='${jsonform}'></d3form></div>`);
    });

    it ('test children errors', (done) => {
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

        timeout(() => {

            expect(id.showError).toBe(false);
            expect(token.showError).toBe(false);

            fv.setSubmit();
            expect(formModel.formSubmitted).toBe(true);

            timeout(() => {
                expect(id.showError).toBe(true);
                expect(token.showError).toBe(true);
                done();
            });
        });
    });
});

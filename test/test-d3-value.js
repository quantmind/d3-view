import {timeout} from 'd3-timer';

import view, {trigger} from './utils';
import {viewElement} from '../index';


describe('d3-value directive', function() {

    it('textarea', (done) => {
        var el = viewElement('<textarea d3-value="foo">Initial text value</textarea>'),
            vm = new view();

        vm.mount(el);
        var model = vm.model;

        expect(model.foo).toBe('Initial text value');

        // Model => DOM binding
        model.foo = 'a new value';
        expect(model.foo).toBe('a new value');
        expect(vm.sel.property('value')).toBe('Initial text value');

        timeout(() => {
            expect(vm.sel.property('value')).toBe('a new value');

            // DOM => Model binding
            vm.sel.property('value', 'ciao');
            trigger(vm.el, 'change');

            expect(model.foo).toBe('a new value');

            timeout(() => {
                expect(model.foo).toBe('ciao');
                done();
            });
        });


    });

});

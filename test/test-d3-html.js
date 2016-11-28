import {timeout} from 'd3-timer';

import view from './utils';
import {viewElement} from '../index';


describe('d3-html directive', function() {

    it('test simple', (done) => {
        var el = viewElement('<div d3-html="test">Bla</div>');

        var vm = view({
            model: {
                test: 'This is a test'
            }
        }).mount(el);

        timeout(() => {
            expect(vm.sel.html()).toBe('This is a test');

            vm.model.test = 'test reactivity';
            expect(vm.sel.html()).toBe('This is a test');

            timeout(() => {
                expect(vm.sel.html()).toBe('test reactivity');
                done();
            });
        });
    });
});

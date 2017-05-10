import {timeout} from 'd3-timer';

import view from './utils';
import {viewElement} from '../index';


describe('d3-attr directive', function() {

    it('test simple', (done) => {
        var el = viewElement('<div d3-attr-foo="test">Bla</div>');

        var vm = view({
            model: {
                test: 'This is a test'
            }
        });
        vm.mount(el);

        timeout(() => {
            expect(vm.sel.attr('foo')).toBe('This is a test');

            vm.model.test = 'test reactivity';
            expect(vm.sel.attr('foo')).toBe('This is a test');

            timeout(() => {
                expect(vm.sel.attr('foo')).toBe('test reactivity');
                done();
            });
        });
    });


    it('test class', (done) => {
        var el = viewElement('<div d3-class="test">Bla</div>');

        var vm = view({
            model: {
                test: 'bright'
            }
        });
        vm.mount(el);

        timeout(() => {
            expect(vm.sel.classed('bright')).toBe(true);

            vm.model.test = 'dark foo';
            expect(vm.sel.classed('bright')).toBe(true);
            expect(vm.sel.classed('dark')).toBe(false);
            expect(vm.sel.classed('foo')).toBe(false);

            timeout(() => {
                expect(vm.sel.classed('bright')).toBe(false);
                expect(vm.sel.classed('dark')).toBe(true);
                expect(vm.sel.classed('foo')).toBe(true);
                done();
            });
        });
    });
});

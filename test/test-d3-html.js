import view from './utils';
import {timeout} from 'd3-timer';


describe('d3-html directive', function() {

    it('test simple', (done) => {
        var el = view.htmlElement('<div d3-html="test">Bla</div>');

        var vm = view({
            el: el,
            model: {
                test: 'This is a test'
            }
        }).mount();

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

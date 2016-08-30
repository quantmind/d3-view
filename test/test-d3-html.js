import View from './utils';
import {htmlElement} from '../';
import {timeout} from 'd3-timer';


describe('d3-html directive', function() {

    it('test simple', (done) => {
        var el = htmlElement('<div d3-html="test">Bla</div>');

        var vm = new View({
            el: el,
            model: {
                test: 'This is a test'
            }
        }).mount();

        expect(vm.sel.html()).toBe('This is a test');

        vm.model.test = 'test reactivity';
        expect(vm.sel.html()).toBe('This is a test');

        timeout(() => {
            expect(vm.sel.html()).toBe('test reactivity');
            done();
        });
    });
});

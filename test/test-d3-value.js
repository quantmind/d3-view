import {timeout} from 'd3-timer';
import view from './utils';


function trigger (target, event, process) {
    var e = document.createEvent('HTMLEvents');
    e.initEvent(event, true, true);
    if (process) process(e);
    target.dispatchEvent(e);
}



describe('d3-value directive', function() {

    it('textarea', (done) => {
        var el = view.htmlElement('<textarea d3-value="foo">Initial text value</textarea>'),
            vm = new view({el: el}).mount(),
            model = vm.model;

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

import {select} from 'd3-selection';
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
        var el = select(document.createElement('textarea'))
            .attr('d3-value', 'foo')
            .property('value', 'Initial text value');

        var vm = new view({el: el}).mount();
        var model = vm.model;

        expect(model.foo).toBe('Initial text value');

        // Model => DOM binding
        model.foo = 'a new value';
        expect(model.foo).toBe('a new value');
        expect(el.property('value')).toBe('Initial text value');

        timeout(() => {
            expect(el.property('value')).toBe('a new value');

            // DOM => Model binding
            el.property('value', 'ciao');
            trigger(el.node(), 'change');

            expect(model.foo).toBe('a new value');

            timeout(() => {
                expect(model.foo).toBe('ciao');
                done();
            });
        });


    });

});

import view, {trigger, getWaiter, testAsync} from './utils';
import {viewElement} from '../index';


describe('d3-on directive', function() {

    it('test no expression', testAsync(async () => {
        var ev,
            waiter = getWaiter(),
            vm = view({
                model: {
                    $test: test
                }
            });
        vm.mount(viewElement('<div><p d3-on="$test($event)">Bla</p></div>'));

        var sel = vm.sel.select('p');

        expect(sel.attr('d3-on')).toBe(null);
        var d = sel.directives().all[0];
        expect(d).toBeTruthy();
        expect(d.name).toBe('d3-on');

        trigger(sel.node(), 'click');
        await waiter.promise;
        expect(ev).toBeTruthy();
        expect(ev.type).toBe('click');
        expect(ev.defaultPrevented).toBe(false);

        function test (event) {
            ev = event;
            waiter.resolve(null);
        }
    }));

    it('test function', (done) => {
        var vm = view({
            model: {
                $test: test
            }
        });
        vm.mount(viewElement('<div><p d3-on="$test()">Bla</p></div>'));

        var sel = vm.sel.select('p');

        expect(sel.attr('d3-on')).toBe(null);
        var d = sel.directives().all[0];
        expect(d).toBeTruthy();
        expect(d.name).toBe('d3-on');

        trigger(sel.node(), 'click');

        function test () {
            if (vm.isMounted) {
                expect(this.parent).toBe(vm.model);
                expect(this.isolated).toBe(false);
                done();
            }
        }
    });
});

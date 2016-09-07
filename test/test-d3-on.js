import view, {trigger} from './utils';
import {viewElement} from '../';


describe('d3-on directive', function() {

    it('test no expression', () => {
        var vm = view().mount(viewElement('<div><p d3-on="test">Bla</p></div>'));

        var sel = vm.sel.select('p');

        expect(sel.attr('d3-on')).toBe(null);
        var d = sel.directives().get('on');
        expect(d).toBeTruthy();

        trigger(sel.node(), 'click');
    });

    it('test function', (done) => {
        var vm = view({
            model: {
                $test: test
            }
        }).mount(viewElement('<div><p d3-on="$test()">Bla</p></div>'));

        var sel = vm.sel.select('p');

        expect(sel.attr('d3-on')).toBe(null);
        var d = sel.directives().get('on');
        expect(d).toBeTruthy();

        trigger(sel.node(), 'click');

        function test () {
            expect(this).toBe(vm.model);
            done();
        }
    });
});

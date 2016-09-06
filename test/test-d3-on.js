import view, {trigger} from './utils';


describe('d3-on directive', function() {

    it('test no expression', () => {
        var vm = view({
            el: view.htmlElement('<div><p d3-on="test">Bla</p></div>')
        }).mount();

        var sel = vm.sel.select('p');

        expect(sel.attr('d3-on')).toBe(null);
        var d = sel.directives().get('on');
        expect(d).toBeTruthy();

        trigger(sel.node(), 'click');
    });

    it('test function', (done) => {
        var vm = view({
            el: view.htmlElement('<div><p d3-on="$test()">Bla</p></div>'),
            model: {
                $test: test
            }
        }).mount();

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

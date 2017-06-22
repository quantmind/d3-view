import view, {testAsync} from './utils';
import {viewDebounce} from '../index';


describe('d3-attr directive', function() {

    const nextTick = viewDebounce();

    it('test simple', testAsync(async () => {

        var vm = view({
            model: {
                test: 'This is a test'
            }
        });
        vm.mount(vm.viewElement('<div d3-attr-foo="test">Bla</div>'));
        await nextTick();

        expect(vm.sel.attr('foo')).toBe('This is a test');
        vm.model.test = 'test reactivity';
        expect(vm.sel.attr('foo')).toBe('This is a test');

        await nextTick();
        expect(vm.sel.attr('foo')).toBe('test reactivity');
    }));


    it('test class', testAsync(async () => {
        var vm = view({
            model: {
                test: 'bright'
            }
        });
        vm.mount(vm.viewElement('<div d3-class="test">Bla</div>'));
        await nextTick();

        expect(vm.sel.classed('bright')).toBe(true);
        vm.model.test = 'dark foo';
        expect(vm.sel.classed('bright')).toBe(true);
        expect(vm.sel.classed('dark')).toBe(false);
        expect(vm.sel.classed('foo')).toBe(false);
        await nextTick();

        expect(vm.sel.classed('bright')).toBe(false);
        expect(vm.sel.classed('dark')).toBe(true);
        expect(vm.sel.classed('foo')).toBe(true);
    }));
});

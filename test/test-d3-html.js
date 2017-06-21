import view, {testAsync} from './utils';
import {viewElement, viewDebounce} from '../index';


describe('d3-html directive', function() {

    const nextTick = viewDebounce();

    it('test simple', testAsync(async () => {
        var el = viewElement('<div d3-html="test">Bla</div>');

        var vm = view({
            model: {
                test: 'This is a test'
            }
        });
        vm.mount(el);

        await nextTick();
        expect(vm.sel.html()).toBe('This is a test');

        vm.model.test = 'test reactivity';
        expect(vm.sel.html()).toBe('This is a test');
        await nextTick();
        expect(vm.sel.html()).toBe('test reactivity');
    }));

    it('test nested one level', testAsync(async () => {
        var vm = view({
            model: {
                messages: {
                    msg1: 'This is a test'
                }
            }
        });
        vm.mount(vm.viewElement('<div d3-html="messages.msg1"></div>'));
        await nextTick();
        expect(vm.sel.html()).toBe('This is a test');

        vm.model.messages.msg1 = 'test reactivity';
        expect(vm.sel.html()).toBe('This is a test');
        await nextTick();
        expect(vm.sel.html()).toBe('test reactivity');
    }));

    it('test nested two levels', testAsync(async () => {
        var vm = view({
            model: {
                messages: {
                    next: {
                        msg1: 'This is a test'
                    }
                }
            }
        });
        vm.mount(vm.viewElement('<div d3-html="messages.next.msg1"></div>'));
        await nextTick();
        expect(vm.sel.html()).toBe('This is a test');

        vm.model.messages.next.msg1 = 'test reactivity';
        vm.model.messages.next.msg1 = 'test reactivity2';
        expect(vm.sel.html()).toBe('This is a test');
        await nextTick();
        expect(vm.sel.html()).toBe('test reactivity2');
    }));
});

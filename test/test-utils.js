import {viewProviders, viewReady, viewDebounce, viewMount} from '../index';
import maybeJson from '../src/utils/maybeJson';
import view, {testAsync} from './utils';


describe('model', () => {

    const nextTick = viewDebounce();

    it ('maybeJson', () => {
        expect(maybeJson('foo')).toBe('foo');
    });

    it ('viewReady', testAsync(async () => {
        var cbs = viewProviders.readyCallbacks,
            called = 0;

        viewReady(ready);
        expect(cbs.length).toBe(0);
        expect(called).toBe(0);

        await nextTick();
        expect(called).toBe(1);

        function ready () {
            called += 1;
        }
    }));

    it ('viewMount', testAsync(async () => {
        var vm = view({
            components: {
                msg: {
                    model: {
                        message: "Hi there!"
                    },
                    render () {
                        return this.viewElement('<p d3-html="message"></p>');
                    }
                }
            }
        });
        var el = vm.viewElement('<div></div>');
        vm.mount(el);
        await viewMount(vm.el, '<msg></msg>', {message: 'test message'});
        expect(vm.sel.select('p').html()).toBe('test message');

        var cm = vm.sel.select('p').view();
        expect(cm.model.message).toBe('test message');
        cm.model.message = 'Bye';
        await nextTick();
        expect(vm.sel.select('p').html()).toBe('Bye');
    }));

});

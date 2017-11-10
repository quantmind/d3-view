import {viewProviders, viewReady, viewDebounce, viewMount} from '../index';
import maybeJson from '../src/utils/maybeJson';
import view, {test} from './utils';


describe('model', () => {

    const nextTick = viewDebounce();

    it ('maybeJson', () => {
        expect(maybeJson('foo')).toBe('foo');
    });

    test ('viewReady', async () => {
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
    });

    test ('viewMount', async () => {
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
        await vm.mount(el);
        await viewMount(vm.el, '<msg></msg>', {message: 'test message'});
        expect(vm.sel.select('p').html()).toBe('test message');

        var cm = vm.sel.select('p').view();
        expect(cm.model.message).toBe('test message');
        cm.model.message = 'Bye';
        await nextTick();
        expect(vm.sel.select('p').html()).toBe('Bye');
    });

    test ('require', async () => {
        var p = viewProviders.require('balbla');
        try {
            await p;
        } catch (e) {
            expect(''+e).toBe('Error: Cannot requires libraries, d3-require is not available');
        }
    });
});

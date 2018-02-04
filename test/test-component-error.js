import view, {test} from './utils';
import {viewEvents, viewProviders} from '../index';


describe('Component Errors -', () => {
    let count, logs;

    function handle (cm) {
        count += 1;
        expect(cm.name).toBe('testing');
    }

    beforeEach(() => {
        count = 0;
        viewProviders.logger.pop();
        viewEvents.on('component-error.test', handle);
    });

    afterEach(() => {
        viewEvents.on('component-error.test', null);
    });

    test('error', async () => {
        var vm = view({
            components: {
                testing () {
                    throw new Error('a synchronous crash');
                }
            }
        });
        await vm.mount(vm.viewElement('<div><testing /></div>'));
        expect(count).toBe(1);
        expect(vm.sel.html()).toBe('<testing></testing>');
        logs = viewProviders.logger.pop();
        expect(logs.length).toBe(1);
        vm.mount('#foo');
        logs = viewProviders.logger.pop();
        expect(logs.length).toBe(1);
    });

    test('no element', async () => {
        var vm = view({
            components: {
                testing () {}
            }
        });
        await vm.mount(vm.viewElement('<div><testing /></div>'));
        expect(count).toBe(1);
        expect(vm.sel.html()).toBe('<testing></testing>');
        logs = viewProviders.logger.pop();
        expect(logs.length).toBe(1);
    });

    test('multiple elements', async () => {
        var vm = view({
            components: {
                testing () {
                    var d = this.select(this.viewElement('<div><p>a</p><p>b</p></div>'));
                    return d.selectAll('p');
                }
            }
        });
        await vm.mount(vm.viewElement('<div><testing /></div>'));
        expect(count).toBe(0);
        expect(vm.sel.html()).toBe('<p>a</p>');
        logs = viewProviders.logger.pop();
        expect(logs.length).toBe(1);
    });

});

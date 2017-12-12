import view, {test, nextTick} from './utils';
import {viewUid} from '../index';

describe('d3-if -', () => {

    test('block', async () => {
        var uid = 'test' + viewUid(),
            vm = view({
                model: {
                    foo: false
                }
            });

        vm.select('body')
            .append('div')
            .attr('id', uid)
            .html('<p d3-if="foo">Hi</p>');

        await vm.mount(`#${uid}`);

        expect(vm.sel.selectAll('p').size()).toBe(1);
        var p = vm.sel.select('p');

        expect(p.style('display')).toBe('none');
        vm.model.foo = true;
        expect(p.style('display')).toBe('none');
        await nextTick();
        expect(p.style('display')).toBe('block');
        vm.sel.remove();
    });

    test('inline', async () => {
        var uid = 'test' + viewUid(),
            vm = view({
                model: {
                    foo: false
                }
            });

        vm.select('body')
            .append('div')
            .attr('id', uid)
            .html('<p d3-if="foo" style="display: inline">Hi there</p>');

        await vm.mount(`#${uid}`);

        expect(vm.sel.selectAll('p').size()).toBe(1);
        var p = vm.sel.select('p');
        expect(p.style('display')).toBe('none');
        vm.model.foo = true;
        expect(p.style('display')).toBe('none');
        await nextTick();
        expect(p.style('display')).toBe('inline');
        vm.sel.remove();
    });
});

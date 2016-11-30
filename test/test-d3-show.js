import view from './utils';
import {viewUid} from '../index';
import {timeout} from 'd3-timer';
import {select} from 'd3-selection';

describe('d3-show directive', function() {

    it('block', (done) => {
        var uid = 'test' + viewUid(),
            vm = view({
                model: {
                    foo: false
                }
            });

        select('body')
            .append('div')
            .attr('id', uid)
            .html('<p d3-show="foo">Hi</p>');

        vm.mount(`#${uid}`);

        expect(vm.sel.selectAll('p').size()).toBe(1);
        var p = vm.sel.select('p');

        expect(p.style('display')).toBe('none');
        vm.model.foo = true;
        expect(p.style('display')).toBe('none');

        timeout(() => {
            expect(p.style('display')).toBe('block');
            vm.sel.remove();
            done();
        });
    });

    it('inline', (done) => {
        var uid = 'test' + viewUid(),
            vm = view({
                model: {
                    foo: false
                }
            });

        select('body')
            .append('div')
            .attr('id', uid)
            .html('<p d3-show="foo" style="display: inline">Hi there</p>');

        vm.mount(`#${uid}`);

        expect(vm.sel.selectAll('p').size()).toBe(1);
        var p = vm.sel.select('p');
        expect(p.style('display')).toBe('none');
        vm.model.foo = true;
        expect(p.style('display')).toBe('none');

        timeout(() => {
            expect(p.style('display')).toBe('inline');
            vm.sel.remove();
            done();
        });
    });
});

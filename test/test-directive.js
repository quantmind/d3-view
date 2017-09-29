import {map} from 'd3-collection';

import {viewDebounce} from '../index';
import view, {testAsync} from './utils';


describe('directive', () => {

    const nextTick = viewDebounce();

    it ('custom', testAsync(async () => {

        var vm = view({
            directives: {
                'dummy': {}
            }
        });

        vm.addDirective('random', {
            refresh () {
                this.sel.html(''+Math.random());
            }
        });
        vm.mount(vm.viewElement('<div d3-random d3-dummy></div>'));
        await nextTick();

        var dirs = vm.sel.directives();
        expect(dirs).toBeTruthy();
        expect(dirs.all.length).toBe(2);
        var mdir = map();
        dirs.all.forEach(d => {mdir.set(d.name, d);});
        var dir = mdir.get('d3-random');
        expect(dir.uid).toBeTruthy();
        expect(dir.name).toBe('d3-random');
        expect(dir.sel.node()).toBe(vm.el);
        expect(dir.active).toBe(true);
        expect(dir.identifiers.length).toBe(1);
        var num = +vm.sel.html();
        expect(num>0).toBe(true);
        //
        vm.model.$change();
        await nextTick();
        var num2 = +vm.sel.html();
        expect(num2>0).toBe(true);
        expect(num2 !== num).toBe(true);
    }));

});

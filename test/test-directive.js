import {viewDebounce} from '../index';
import view, {testAsync} from './utils';


describe('directive', function() {

    const nextTick = viewDebounce();

    it ('custom', testAsync(async () => {

        var vm = view();
        vm.addDirective('random', {
            refresh () {
                this.sel.html(''+Math.random());
            }
        });
        vm.mount(vm.viewElement('<div d3-random></div>'));
        await nextTick();

        var dirs = vm.sel.directives();
        expect(dirs).toBeTruthy();
        expect(dirs.all.length).toBeTruthy();
        var dir = dirs.all[0];
        expect(dir.uid).toBeTruthy();
        expect(dir.name).toBe('d3-random');
        expect(dir.sel.node()).toBe(vm.el);
        expect(dir.active).toBe(true);
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

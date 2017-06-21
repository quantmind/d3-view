import {viewDebounce} from '../index';
import view, {testAsync} from './utils';


describe('directive', function() {

    const nextTick = viewDebounce();

    it ('custom', testAsync(async () => {

        var vm = view();
        vm.addDirective('random', {
            refresh (model, value) {
                return value;
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
        // vm.mount(vm.viewElement('<div d3-random></div>'));


    }));

});

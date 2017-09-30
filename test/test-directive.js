import {map} from 'd3-collection';
import {isString} from 'd3-let';

import {viewDebounce} from '../index';
import view, {testAsync, getWaiter} from './utils';


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

    it ('active', testAsync(async () => {

        var vm = view(),
            el = vm.select('body').append('div').html('<div id="target"></div><div id="key" d3-collapse="#target"></div>'),
            gone = getWaiter();

        vm.addDirective('collapse', {
            create (expr) {
                this.target = expr;
                this.active = true;
            },
            refresh (model) {
                // the model is the root model
                expect(model.parent).toBe(undefined);
                model.testingFlag = true;
                if (isString(this.target)) this.target = this.select(this.target);
                this.target.classed('foo', true);
            },
            destroy (model) {
                gone.resolve();
                expect(model.parent).toBe(undefined);
                expect(model.testingFlag).toBe(true);
            }
        });
        vm.mount(el);
        await nextTick();

        var dirs = vm.sel.select('#key').directives();
        expect(dirs).toBeTruthy();
        expect(dirs.all.length).toBe(1);
        var dir = dirs.all[0];
        expect(dir.uid).toBeTruthy();
        expect(dir.name).toBe('d3-collapse');
        expect(dir.active).toBe(true);
        expect(dir.target).toBeTruthy();
        expect(dir.target.attr('id')).toBe('target');
        expect(dir.expression).toBe(undefined);
        //
        // remove element
        vm.sel.remove();
        await gone.promise;
    }));

});

import {isString, isFunction} from 'd3-let';

import view from './utils';
import {viewProviders, viewVersion, viewElement} from '../index';


var logger = viewProviders.logger;


describe('view meta', function() {

    it('view function', () => {
        expect(isFunction(view)).toBe(true);
        expect(isString(viewVersion)).toBe(true);
    });

    it('No element', function () {
        logger.pop();
        view().mount();
        expect(logger.pop().length).toBe(1);
    });

});


describe('view', function() {

    let el;

    beforeEach(() => {
        el = document.createElement('div');
    });

    it('API', () => {
        var vm = view();
        expect(vm.el).toBe(undefined);
        expect(vm.sel).toBe(undefined);
        expect(vm.isd3).toBe(true);
        expect(vm.parent).toBe(undefined);
        expect(vm.directives.size()).toBe(7);

        vm.mount(el);
        expect(vm.el).toBe(el);
        expect(vm.sel.node()).toBe(el);
        expect(vm.uid).toBeGreaterThan('d3v0');
        expect(vm.model.uid).toBe(vm.uid);
        expect(vm.isMounted).toBe(true);
        expect(vm.root).toBe(vm);
        expect(vm.parent).toBe(undefined);
        expect(() => {vm.model.uid = -5;}).toThrow();
    });

    it('view.mounted hook', () => {
        var mounted = false;
        var vm = view({
            mounted: function () {
                mounted = true;
            }
        });
        vm.mount(viewElement('<div id="test1"><year></year></div>'));
        expect(mounted).toBe(false);
        expect(vm.sel.view()).toBe(vm);
    });

    it('view.model.$on warn', () => {
        logger.pop();
        var vm = view();
        vm.mount(el);
        vm.model.$on('bla');
        var logs = logger.pop();
        expect(logs.length).toBe(1);
        expect(logs[0]).toBe(`[d3-view] Cannot bind to "bla" - no such reactive property`);
    });

    it('view.model.$on', (done) => {
        var vm = view();
        vm.mount(el);

        var model = vm.model;
        model.$set('bla', 5);
        model.$on('bla.test', changed);
        expect(model.bla).toBe(5);
        model.bla = 6;
        expect(model.bla).toBe(6);

        function changed (value, oldValue) {
            expect(this).toBe(model);
            expect(model.bla).toBe(6);
            expect(value).toBe(6);
            expect(oldValue).toBe(undefined);

            model.$on('bla.test', changed2);
            model.bla = 4;
        }

        function changed2 (value, oldValue) {
            expect(this).toBe(model);
            expect(model.bla).toBe(4);
            expect(value).toBe(4);
            expect(oldValue).toBe(6);
            done();
        }
    });

    it('model with no binding properties', () => {
        var vm = view({
            model: {
                $test: 'this is a test'
            }
        });
        vm.mount(el);
        var model = vm.model;
        expect(model.$events.get('$test')).toBe(undefined);
        logger.pop();
        model.$on('$test', ()=>{});
        var logs = logger.pop();
        expect(logs.length).toBe(1);
        expect(logs[0]).toBe(`[d3-view] Cannot bind to "$test" - no such reactive property`);
        expect(model.$test).toBe('this is a test');
    });
});

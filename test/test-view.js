import {isString, isFunction} from 'd3-let';

import view, {test, getWaiter} from './utils';
import {viewProviders, viewVersion, viewElement, viewBase} from '../index';


var logger = viewProviders.logger;


describe('view meta -', () => {

    it('view function', () => {
        expect(isFunction(view)).toBe(true);
        expect(isString(viewVersion)).toBe(true);
    });

    test('No element', async () => {
        logger.pop();
        await view().mount();
        expect(logger.pop().length).toBe(1);
    });

});


describe('view -', () => {

    let el;

    beforeEach(() => {
        el = document.createElement('div');
    });

    test('API', async () => {
        var vm = view();
        expect(vm.el).toBe(undefined);
        expect(vm.sel).toBe(undefined);
        expect(vm.isd3).toBe(true);
        expect(vm.parent).toBe(undefined);
        expect(vm.directives.size()).toBe(6);

        await vm.mount(el);
        expect(vm.el).toBe(el);
        expect(vm.sel.node()).toBe(el);
        expect(vm.uid).toBeGreaterThan('d3v0');
        expect(vm.model.uid).toBe(vm.uid);
        expect(vm.isMounted).toBe(true);
        expect(vm.root).toBe(vm);
        expect(vm.parent).toBe(undefined);
        expect(() => {vm.model.uid = -5;}).toThrow();
        //
        // test mounted already
        logger.pop();
        vm.mount(el);
        var logs = logger.pop();
        expect(logs.length).toBe(1);
        expect(logs[0]).toBe('[view] component already mounted');
    });

    test('mounted hook', async () => {
        var mounted = false;
        var vm = view({});
        await vm.mount(viewElement('<div id="test1"><year></year></div>'), () => {
            mounted = true;
        });
        expect(mounted).toBe(true);
        expect(vm.sel.view()).toBe(vm);
    });

    test('model.$on warn', async () => {
        logger.pop();
        var vm = view();
        await vm.mount(el);
        vm.model.$on('bla');
        var logs = logger.pop();
        expect(logs.length).toBe(1);
        expect(logs[0]).toBe(`[d3-view] Cannot bind to "bla" - no such reactive property`);
    });

    test('model.$on', async () => {
        var vm = view(),
            waiter = getWaiter();
        await vm.mount(el);

        var model = vm.model;
        model.$set('bla', 5);
        model.$on('bla.test', changed);
        expect(model.bla).toBe(5);
        model.bla = 6;
        expect(model.bla).toBe(6);
        await waiter.promise;

        function changed (oldValue) {
            expect(this).toBe(model);
            expect(model.bla).toBe(6);
            expect(oldValue).toBe(undefined);

            model.$on('bla.test', changed2);
            model.bla = 4;
        }

        function changed2 (oldValue) {
            expect(this).toBe(model);
            expect(model.bla).toBe(4);
            expect(oldValue).toBe(6);
            waiter.resolve();
        }
    });

    test('model with no binding properties', async () => {
        var vm = view({
            model: {
                $test: 'this is a test'
            }
        });
        await vm.mount(el);
        var model = vm.model;
        expect(model.$events.get('$test')).toBe(undefined);
        logger.pop();
        model.$on('$test', ()=>{});
        var logs = logger.pop();
        expect(logs.length).toBe(1);
        expect(logs[0]).toBe(`[d3-view] Cannot bind to "$test" - no such reactive property`);
        expect(model.$test).toBe('this is a test');
    });

    it('extendibility', () => {
        viewBase.fooo = function () {
            return 'OK';
        };
        var vm = view();
        expect(vm.fooo()).toBe('OK');
    });

    it('logging', () => {
        logger.pop();
        var vm = view();
        expect(vm.logError('test1')).toBe(vm);
        expect(logger.pop()).toEqual(['[view] test1']);
        expect(vm.logWarn('test2')).toBe(vm);
        expect(logger.pop()).toEqual(['[view] test2']);
        expect(vm.logInfo('test3')).toBe(vm);
        expect(logger.pop()).toEqual(['[view] test3']);
        expect(vm.logDebug('test4')).toBe(vm);
        expect(logger.pop()).toEqual([]);
        try {
            throw new Error('kaputt');
        } catch (err) {
            vm.logError(err);
        }
        var stack = logger.pop();
        expect(stack.length).toBe(1);
        expect(''+stack[0]).toBe('Error: kaputt');
    });

    it ('domEvent', () => {
        var vm = view();
        expect(vm.domEvent()).toBe(null);
    });
});

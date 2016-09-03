import {isObject, isString} from 'd3-let';
import view from './utils';

var logger = view.providers.logger;

describe('view meta', function() {

    it('view function', () => {
        expect(isString(view.version)).toBe(true);
        expect(isObject(view.directives)).toBe(true);
    });

    it('No element', function () {
        logger.pop();
        view();
        expect(logger.pop().length).toBe(1);
    });

});


describe('view', function() {

    let el;

    beforeEach(() => {
        el = document.createElement('div');
    });

    it('Element', () => {
        var vm = view({'el': el});
        expect(vm.el).toBe(el);
        expect(vm.isd3).toBe(true);
        expect(vm.uid).toBeGreaterThan(0);
        expect(vm.model.uid).toBe(vm.uid);
        expect(vm.parent).toBe(undefined);
        expect(vm.root).toBe(vm);
        expect(vm.isMounted).toBe(false);
        expect(() => {vm.model.uid = -5;}).toThrow();
        expect(vm.uid).toBeGreaterThan(0);
    });

    it('view.model.$on warn', () => {
        logger.pop();
        var vm = new view({'el': el});
        vm.model.$on('bla');
        var logs = logger.pop();
        expect(logs.length).toBe(1);
        expect(logs[0]).toBe(`[d3-view] Cannot bind to "bla" - no such reactive property`);
    });

    it('view.model.$on', (done) => {
        var vm = view({'el': el});
        vm.model.$set('bla', 5);
        vm.model.$on('bla', changed);
        expect(vm.model.bla).toBe(5);
        vm.model.bla = 4;

        function changed (value, oldValue) {
            expect(this).toBe(vm.model);
            expect(vm.model.bla).toBe(4);
            expect(value).toBe(4);
            expect(oldValue).toBe(5);
            done();
        }
    });
});

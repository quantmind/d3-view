import {isObject, isString} from 'd3-let';
import View from './utils';


describe('View meta', function() {

    it('View class', () => {
        expect(isString(View.version)).toBe(true);
        expect(isObject(View.directives)).toBe(true);
    });

    it('No element', function () {
        var vm = new View();
        expect(vm.testContext.warn.length).toBe(1);
    });

});


describe('View', function() {

    let el;

    beforeEach(() => {
        el = document.createElement('div');
    });

    it('Element', function () {
        var vm = new View({'el': el});
        expect(vm.el).toBe(el);
        expect(vm.uid).toBeGreaterThan(0);
        expect(vm.scope.$uid).toBe(vm.uid);
    });

});

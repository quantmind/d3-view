import {isObject, isString} from 'd3-let';
import {View} from '../';


describe('View', function() {

    it('View class', () => {
        expect(isString(View.version)).toBe(true);
        expect(isObject(View.directives)).toBe(true);
    });
});

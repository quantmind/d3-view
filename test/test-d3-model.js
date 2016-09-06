import './utils';
import {model} from '../src/model';
import {isFunction} from 'd3-let';


describe('model', function() {

    it('constructor', () => {

        var m = model({
            '$test': function () {
                return 'a test';
            }
        });

        expect(isFunction(m.$test)).toBe(true);
        expect(m.$test()).toBe('a test');
    });
});

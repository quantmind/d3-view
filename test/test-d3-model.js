import {isFunction} from 'd3-let';

import './utils';
import {viewModel} from '../';


describe('model', function() {

    it('constructor', () => {

        var model = viewModel({
            '$test': function () {
                return 'a test';
            }
        });

        expect(isFunction(model.$test)).toBe(true);
        expect(model.$test()).toBe('a test');
    });
});

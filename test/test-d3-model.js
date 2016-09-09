import {isFunction} from 'd3-let';

import './utils';
import {viewModel} from '../';


describe('model', function() {

    it('view constructor', () => {

        var model = viewModel({
            '$test': function () {
                return 'a test';
            }
        });

        expect(isFunction(model.$test)).toBe(true);
        expect(model.$test()).toBe('a test');
    });

    it('parent-child binding', (done) => {

        var model = viewModel({foo: 5});
        expect(model.foo).toBe(5);
        expect(model.$events.get('foo')).toBeTruthy();
        var child = model.$child();
        expect(child.foo).toBe(5);
        child.$on('foo', callback);

        function callback (value) {
            if (value === 5)
                model.foo = 8;
            else {
                expect(value).toBe(8);
                done();
            }
        }
    });
});

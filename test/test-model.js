import {timeout} from 'd3-timer';

import {viewModel} from '../index';


describe('model', function() {

    it('model.$unbind', (done) => {
        var model = viewModel({
            foo: 5,
            bla: 2
        });
        var child = model.$child(),
            foov = null;
        expect(child.parent).toBe(model);
        expect(model.$events.size()).toBe(3);
        expect(child.$events.size()).toBe(1);

        model.$on('foo', function (value) {
            foov = value;
        });

        model.foo = 8;

        timeout(() => {
            expect(foov).toBe(8);
            model.$off();
            model.foo = 10;

            timeout(() => {
                expect(foov).toBe(8);
                expect(model.$events.size()).toBe(3);
                expect(child.$events.size()).toBe(1);
                done();
            });
        });
    });
});

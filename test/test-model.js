import {timeout} from 'd3-timer';

import {viewModel} from '../index';


describe('model', function() {

    it('model.$off', (done) => {
        var model = viewModel({
            foo: 5,
            bla: 2
        });
        var child = model.$child(),
            foov = null;
        expect(child.parent).toBe(model);
        expect(model.$events.size()).toBe(3);
        expect(child.$events.size()).toBe(1);

        model.$on('foo', function (oldValue) {
            foov = oldValue;
        });

        timeout(() => {
            expect(foov).toBe(undefined);
            model.foo = 8;
            timeout(() => {
                expect(foov).toBe(5);
                model.$off();
                model.foo = 10;

                timeout(() => {
                    expect(foov).toBe(5);
                    expect(model.$events.size()).toBe(3);
                    expect(child.$events.size()).toBe(1);
                    done();
                });
            });
        });
    });
});

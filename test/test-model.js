import {timeout} from 'd3-timer';
import {isFunction, isArray} from 'd3-let';

import {viewModel, viewDebounce} from '../index';
import {testAsync} from './utils';


describe('model', function() {

    const nextTick = viewDebounce(),
          delayAdd = viewDebounce((a, b) => a + b),
          delayError = viewDebounce((text) => {
              throw new Error(text);
          });

    it ('debounce', testAsync(async () => {
        var promise = nextTick();
        expect(nextTick()).toBe(promise);
        var value = await promise;
        expect(value).toBe(undefined);
        var promise2 = nextTick();
        expect(promise2).not.toBe(promise);
        expect(nextTick()).toBe(promise2);
        await promise2;
        value = await delayAdd(2, 4);
        expect(value).toBe(6);
    }));

    it ('debounce reject', testAsync(async () => {
        var message = await delayError('whaaa!').catch((err) => {
            return err.message;
        });
        expect(message).toBe('whaaa!');
    }));

    it('parent-child binding', (done) => {

        var model = viewModel({foo: 5});
        expect(model.foo).toBe(5);
        expect(model.$events.get('foo')).toBeTruthy();
        var child = model.$child();
        expect(child.foo).toBe(5);
        child.$on('foo', callback);

        function callback (oldValue) {
            if (oldValue === undefined)
                model.foo = 8;
            else {
                expect(oldValue).toBe(5);
                done();
            }
        }
    });

    it('update', () => {
        var model = viewModel({foo: 5});
        model.$update({foo: 6});

        expect(model.foo).toBe(6);

        model.$update({foo: 'g'}, true);

        expect(model.foo).toBe('g');

        model.$update({foo: 'k'}, false);

        expect(model.foo).toBe('g');
    });

    it('model function', () => {

        var model = viewModel({
            '$test': function () {
                return 'a test';
            }
        });

        expect(isFunction(model.$test)).toBe(true);
        expect(model.$test()).toBe('a test');
    });

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

    it('model.$off attribute', testAsync(async () => {
        var model = viewModel({
            foo: 5,
            bla: 2
        });
        var called = 0;
        model.$on('foo.test', handler);
        await nextTick();

        expect(called).toBe(1);
        model.foo = 4;
        await nextTick();

        expect(called).toBe(2);

        model.$off('foo.test');

        model.foo = 5;
        await nextTick();

        expect(called).toBe(2);

        function handler () {
            called += 1;
        }
    }));

    it ('model child', testAsync(async () => {
        var model = viewModel({
            foo: 5,
            bla: {
                a: 'test',
                b: {
                    c: 2
                }
            }
        });
        expect(model.bla instanceof viewModel).toBe(true);
        expect(model.bla.b instanceof viewModel).toBe(true);

        var called = 0;
        model.bla.$on('a', () => {
            called += 1;
        });

        model.bla.a = 5;
        await nextTick();
        expect(called).toBe(1);
    }));

    it ('model child override', testAsync(async () => {
        var model = viewModel({
            foo: 5,
            bla: {
                a: 'test',
                b: {
                    c: 2
                }
            }
        });
        expect(model.bla instanceof viewModel).toBe(true);
        expect(model.bla.b instanceof viewModel).toBe(true);
        var b = model.bla.b;
        var called = 0;
        model.bla.$on('b', () => {
            called += 1;
        });
        model.bla.b = [1, 3, 4];
        await nextTick();
        expect(called).toBe(1);
        expect(isArray(model.bla.b)).toBe(true);
        b.$events.each(event => {
            expect(event.on('change')).toBe(undefined);
        });
    }));
});

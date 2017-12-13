import {test} from './utils';

import {timeout} from 'd3-timer';
import {isFunction, isArray} from 'd3-let';
import {viewModel, viewDebounce, viewProviders} from '../index';


describe('model -', function() {

    const nextTick = viewDebounce(),
          delayAdd = viewDebounce((a, b) => a + b),
          delayError = viewDebounce((text) => {
              throw new Error(text);
          });

    test ('debounce', async () => {
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
    });

    test ('debounce reject', async () => {
        var message = await delayError('whaaa!').catch((err) => {
            return err.message;
        });
        expect(message).toBe('whaaa!');
    });

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

    it('$off', (done) => {
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

    test ('$off attribute', async () => {
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
    });

    test ('child', async () => {
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
    });

    test ('child override', async () => {
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
    });

    test ('$isReactive', async () => {
        var model = viewModel({
            a: 4
        });
        expect(model.$isReactive('a')).toBe(true);
        expect(model.$isReactive('b')).toBe(false);
        model.b = 5;
        expect(model.$isReactive('b')).toBe(false);
        var b = model.$new();
        expect(b.$isReactive('a')).toBe(false);
        expect(b.$isReactive('b')).toBe(false);
        expect(b.isolated).toBe(true);
        var c = model.$child({b: 6});
        expect(c.$isReactive('a')).toBe(true);
        expect(c.$isReactive('b')).toBe(true);
        expect(c.isolated).toBe(false);
    });

    test ('$push & $splice', async () => {
        var model = viewModel({
            a: []
        });
        expect(model.$isReactive('a')).toBe(true);
        model.$push('a', 4).$push('a', 5).$push('a', 8);
        var event = model.$events.get('a');
        expect(event.triggered()).toBe(0);
        await nextTick();
        expect(event.triggered()).toBe(1);
        expect(model.a).toEqual([4, 5, 8]);
        model.$splice('a', 1);
        await nextTick();
        expect(event.triggered()).toBe(2);
        expect(model.a).toEqual([4]);
        model.$push('a', 5).$push('a', 8);
        model.$splice('a', 1, 1);
        await nextTick();
        expect(event.triggered()).toBe(3);
        expect(model.a).toEqual([4, 8]);
    });

    test ('$data', async () => {
        var model = viewModel({
            a: [3, 4],
            b: 'hello'
        });
        var data = model.$data();
        expect(Object.keys(data).length).toBe(2);
        expect(data.a).toEqual([3, 4]);
        expect(data.b).toEqual('hello');
    });

    test ('debug', async () => {
        const logger = viewProviders.logger;
        viewProviders.setDebug();
        var model = viewModel({a: 3});
        expect(logger.popInfo().length).toBe(0);
        // set a new value
        model.a = 4;
        model.a = 5;
        var logs = logger.popInfo();
        expect(logs.length).toBe(2);
        expect(logs[0]).toBe('[d3-model] updating model.a');
        expect(logs[1]).toBe('[d3-model] updating model.a');
        viewProviders.setDebug(false);
        expect(logger.debug).toBe(null);
    });
});

import {viewProviders, viewReady, viewDebounce} from '../index';
import maybeJson from '../src/utils/maybeJson';
import {testAsync} from './utils';


describe('model', () => {

    const nextTick = viewDebounce();

    it ('maybeJson', () => {
        expect(maybeJson('foo')).toBe('foo');
    });

    it ('viewReady', testAsync(async () => {
        var cbs = viewProviders.readyCallbacks,
            called = 0;

        viewReady(ready);
        expect(cbs.length).toBe(0);
        expect(called).toBe(0);

        await nextTick();
        expect(called).toBe(1);

        function ready () {
            called += 1;
        }
    }));

});

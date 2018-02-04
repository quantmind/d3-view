import {test} from './utils';
import {viewResolve, viewRequire, viewLibs} from '../index';


describe('d3.resolve -', () => {
    var origin = window.location.origin;

    it ('no dist', () => {
        expect(viewResolve('foo')).toBe('https://unpkg.com/foo');
        expect(viewResolve('foo', {path: 'bla'})).toBe('https://unpkg.com/foo/bla');
        expect(viewResolve('/foo')).toBe(`${origin}/foo`);
        expect(viewResolve('/foo', {base: 'http://bla.com'})).toBe('http://bla.com/foo');
        expect(viewResolve('/foo', {path: 'bla'})).toBe(`${origin}/bla`);
        expect(viewResolve('http://bla.com/foo')).toBe('http://bla.com/foo');
    });

    it ('dist', () => {
        viewLibs.set('d3-selection', {
            'version': 1.1
        });
        expect(viewResolve('d3-selection')).toBe('https://unpkg.com/d3-selection@1.1');
    });

    it ('dist main', () => {
        viewLibs.set('pippo', {
            'main': 'lib/pippo.js',
            'version': 1.4
        });
        expect(viewResolve('pippo')).toBe('https://unpkg.com/pippo@1.4/lib/pippo.js');
        expect(viewResolve('pippo', {path: 'lib/pippo.html'})).toBe('https://unpkg.com/pippo@1.4/lib/pippo.html');
        viewLibs.set('pippo', {
            'main': 'lib/pippo.js'
        });
        expect(viewResolve('pippo')).toBe('https://unpkg.com/pippo/lib/pippo.js');
        expect(viewResolve('pippo', {path: 'lib/pippo.html'})).toBe('https://unpkg.com/pippo/lib/pippo.html');
    });

    it ('dist local', () => {
        viewLibs.set('pluto', {
            'main': 'lib/pluto.js',
            'origin': '/'
        });
        expect(viewResolve('pluto')).toBe(`${origin}/lib/pluto.js`);
        expect(viewResolve('pluto', {path: 'lib/pluto.html'})).toBe(`${origin}/lib/pluto.html`);
    });

    test ('viewRequire', async () => {
        const o = await viewRequire('d3-selection');
        expect(o.select).toBeTruthy();
    });

    test ('viewRequire merge', async () => {
        const o = await viewRequire('d3-selection', 'd3-transition');
        expect(o.select).toBeTruthy();
        expect(o.transition).toBeTruthy();
    });
});

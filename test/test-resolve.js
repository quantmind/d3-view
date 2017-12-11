import {resolve, require} from '../src/require';


describe('d3.resolve -', () => {
    var origin = window.location.origin;

    it ('no dist', () => {
        expect(resolve('foo')).toBe('https://unpkg.com/foo');
        expect(resolve('foo', {path: 'bla'})).toBe('https://unpkg.com/foo/bla');
        expect(resolve('/foo')).toBe(`${origin}/foo`);
        expect(resolve('/foo', {base: 'http://bla.com'})).toBe('http://bla.com/foo');
        expect(resolve('/foo', {path: 'bla'})).toBe(`${origin}/bla`);
    });

    it ('dist', () => {
        require.libs.set('d3-selection', {
            'version': 1.1
        });
        expect(resolve('d3-selection')).toBe('https://unpkg.com/d3-selection@1.1');
    });

    it ('dist main', () => {
        require.libs.set('pippo', {
            'main': 'lib/pippo.js',
            'version': 1.4
        });
        expect(resolve('pippo')).toBe('https://unpkg.com/pippo@1.4/lib/pippo.js');
        expect(resolve('pippo', {path: 'lib/pippo.html'})).toBe('https://unpkg.com/pippo@1.4/lib/pippo.html');
        require.libs.set('pippo', {
            'main': 'lib/pippo.js'
        });
        expect(resolve('pippo')).toBe('https://unpkg.com/pippo/lib/pippo.js');
        expect(resolve('pippo', {path: 'lib/pippo.html'})).toBe('https://unpkg.com/pippo/lib/pippo.html');
    });

    it ('dist local', () => {
        require.libs.set('pluto', {
            'main': 'lib/pluto.js',
            'origin': '/'
        });
        expect(resolve('pluto')).toBe(`${origin}/lib/pluto.js`);
        expect(resolve('pluto', {path: 'lib/pluto.html'})).toBe(`${origin}/lib/pluto.html`);
    });
});

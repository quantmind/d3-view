import json from 'rollup-plugin-json';
import babel from 'rollup-plugin-babel';
import sourcemaps from 'rollup-plugin-sourcemaps';


const pkg = require('../package.json');
const external = Object.keys(pkg.dependencies);


export default {
    input: 'index.js',
    external: external,
    output: {
        file: 'build/d3-view.js',
        format: 'umd',
        extend: true,
        sourcemap: true,
        name: 'd3',
        globals: external.reduce((g, name) => {g[name] = 'd3'; return g;}, {})
    },
    plugins: [
        json(),
        babel({
            babelrc: false,
            plugins: ['external-helpers'],
            presets: ['es2015-rollup'],
            externalHelpers: true
        }),
        sourcemaps()
    ]
};

import json from 'rollup-plugin-json';
import babel from 'rollup-plugin-babel';
import commonjs from 'rollup-plugin-commonjs';
import sourcemaps from 'rollup-plugin-sourcemaps';


export default {
    input: 'index.js',
    output: {
        file: 'build/d3-view.js',
        format: 'umd',
        sourcemap: true
    },
    name: 'd3',
    plugins: [
        json(),
        babel({
            babelrc: false,
            presets: ['es2015-rollup']
        }),
        commonjs(),
        sourcemaps()
    ],
    extend: true,
    external: [
        "d3-collection",
        "d3-dispatch",
        "d3-let",
        "d3-selection",
        "d3-timer",
        "d3-transition",
        "d3-view",
        "object-assign"
    ],
    globals: {
        "d3-collection": "d3",
        "d3-dispatch": "d3",
        "d3-let": "d3",
        "d3-selection": "d3",
        "d3-timer": "d3",
        "d3-transition": "d3",
        "d3-view": "d3",
        "object-assign": "assign"
    }
};

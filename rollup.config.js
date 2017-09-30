import json from 'rollup-plugin-json';
import babel from 'rollup-plugin-babel';
import sourcemaps from 'rollup-plugin-sourcemaps';


export default {
    input: 'index.js',
    output: {
        file: 'build/d3-view.js',
        format: 'umd',
        extend: true,
        sourcemap: true,
        name: 'd3',
        globals: {
            "d3-collection": "d3",
            "d3-dispatch": "d3",
            "d3-let": "d3",
            "d3-require": "d3",
            "d3-selection": "d3",
            "d3-timer": "d3",
            "object-assign": "assign"
        }
    },
    plugins: [
        json(),
        babel({
            babelrc: false,
            presets: ['es2015-rollup']
        }),
        sourcemaps()
    ],
    external: [
        "d3-collection",
        "d3-dispatch",
        "d3-let",
        "d3-require",
        "d3-selection",
        "d3-timer",
        "object-assign"
    ]
};

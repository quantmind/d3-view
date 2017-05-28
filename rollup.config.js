import json from 'rollup-plugin-json';
import babel from 'rollup-plugin-babel';
import node from 'rollup-plugin-node-resolve';
import sourcemaps from 'rollup-plugin-sourcemaps';


export default {
    entry: 'index.js',
    format: 'umd',
    moduleName: 'd3',
    plugins: [
        json(),
        babel({
            babelrc: false,
            presets: ['es2015-rollup']
        }),
        // in clude d3-let in the bundle
        node(),
        sourcemaps()
    ],
    sourceMap: true,
    dest: 'build/d3-view.js',
    external: [
        "d3-collection",
        "d3-dispatch",
        "d3-selection",
        "d3-timer",
        "d3-transition"
    ],
    globals: {
        "d3-collection": "d3",
        "d3-dispatch": "d3",
        "d3-let": "d3",
        "d3-selection": "d3",
        "d3-timer": "d3",
        "d3-transition": "d3"
    }
};

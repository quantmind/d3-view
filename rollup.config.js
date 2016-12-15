import json from 'rollup-plugin-json';
import babel from 'rollup-plugin-babel';


export default {
    entry: 'index.js',
    format: 'umd',
    moduleName: 'd3',
    plugins: [
        json(),
        babel({
            babelrc: false,
            presets: ['es2015-rollup']
        })
    ],
    dest: 'build/d3-view.js',
    globals: {
        "d3-collection": "d3",
        "d3-dispatch": "d3",
        "d3-let": "d3",
        "d3-selection": "d3",
        "d3-timer": "d3",
        "d3-transition": "d3"
    }
};

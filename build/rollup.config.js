import json from 'rollup-plugin-json';
import babel from 'rollup-plugin-babel';
import node from 'rollup-plugin-node-resolve';


export default {
    entry: 'index.js',
    format: 'umd',
    moduleName: 'd3',
    moduleId: 'd3-view',
    plugins: [
        json(),
        babel({
            babelrc: false,
            presets: ['es2015-rollup']
        }),
        node({
            skip: [
                'd3-collection',
                'd3-dispatch',
                'd3-selection',
                'd3-timer',
                'd3-transition'
            ]
        })
    ],
    dest: 'dist/d3-view.js',
    globals: {
        "d3-collection": "d3",
        "d3-dispatch": "d3",
        "d3-selection": "d3",
        "d3-timer": "d3",
        "d3-transition": "d3"
    }
};

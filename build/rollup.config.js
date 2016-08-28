import json from 'rollup-plugin-json';
import babel from 'rollup-plugin-babel';
import nodeResolve from 'rollup-plugin-node-resolve';


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
        nodeResolve({
            jsnext: true,
            main: true,
            skip: ['axios']
        })
    ],
    dest: 'dist/d3-view.js',
    globals: {
        "axios": "axios"
    }
};

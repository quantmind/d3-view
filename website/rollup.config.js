// Rollup plugins
import json from 'rollup-plugin-json';
import commonjs from 'rollup-plugin-commonjs';

import sourcemaps from 'rollup-plugin-sourcemaps';
import resolve from 'rollup-plugin-node-resolve';
import sass from 'rollup-plugin-sass';
import string from 'rollup-plugin-string';
import uglify from 'rollup-plugin-uglify';


const PROD = (process.env.NODE_ENV === 'prod');
const pkg = require('./package.json');
let external = Object.keys(pkg.dependencies);

if (!PROD)
    external = external.concat([
        'd3-dispatch', 'd3-ease', 'd3-let', 'd3-selection', 'd3-timer', 'd3-transition'
    ]);


const globals = external.reduce((g, name) => {g[name] = name.substring(0, 3) === 'd3-' ? 'd3' : name; return g;}, {});


export default {
    input: 'src/index.js',
    external: external,
    output: {
        file: 'static/app.js',
        format: 'umd',
        extend: true,
        sourcemap: true,
        name: 'd3',
        globals: globals
    },
    plugins: [
        json(),
        commonjs(),
        sourcemaps(),
        resolve(),
        string({
            include: '../../d3-view-components/src/**/*.html'
        }),
        sass({
            output: 'static/site.css',
            options: {
                includePaths: ['node_modules'],
                outputStyle: 'compressed'
            }
        }),
        (PROD && uglify())
    ]
};

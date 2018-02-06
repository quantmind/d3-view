import json from 'rollup-plugin-json';
import commonjs from 'rollup-plugin-commonjs';
import sourcemaps from 'rollup-plugin-sourcemaps';
import resolve from 'rollup-plugin-node-resolve';
import string from 'rollup-plugin-string';
import uglify from 'rollup-plugin-uglify';


const DEV = (process.env.NODE_ENV === 'dev');
const pkg = require('./package.json');
let external = Object.keys(pkg.dependencies);


const plugins = [
    json(),
    commonjs(),
    sourcemaps(),
    resolve(),
    string({
        include: '../../d3-view-components/src/**/*.html'
    }),
];

if (DEV)
    external = external.concat([
        'd3-dispatch', 'd3-ease', 'd3-let', 'd3-selection', 'd3-timer', 'd3-transition'
    ]);
else
    plugins.push(uglify());


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
    ]
};

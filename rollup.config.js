import json from 'rollup-plugin-json';
import babel from 'rollup-plugin-babel';
import sourcemaps from 'rollup-plugin-sourcemaps';
import commonjs from 'rollup-plugin-commonjs';
import resolve from 'rollup-plugin-node-resolve';
import uglify from 'rollup-plugin-uglify';


const pkg = require('./package.json');
const external = Object.keys(pkg.dependencies);


export default [
    {
        input: 'index.js',
        external: external,
        output: {
            file: 'build/d3-view-legacy.js',
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
            sourcemaps(),
            resolve()
        ]
    },
    {
        input: 'index.js',
        external: external,
        output: {
            file: 'build/d3-view.js',
            format: 'es',
            extend: true,
            sourcemap: true,
            name: 'd3',
            globals: external.reduce((g, name) => {g[name] = 'd3'; return g;}, {})
        },
        plugins: [
            json(),
            sourcemaps(),
            resolve(),
            uglify()
        ]
    },
    {
        input: 'index-require.js',
        output: {
            file: 'build/d3-require.js',
            format: 'umd',
            sourcemap: false,
            extend: true,
            name: 'd3'
        },
        plugins: [
            resolve(),
            babel({
                babelrc: false,
                plugins: ['external-helpers'],
                presets: ['es2015-rollup']
            })
        ]
    },
    {
        input: 'src/bin/index.js',
        output: {
            file: 'bin/view-require',
            format: 'cjs',
            banner: '#!/usr/bin/env node'
        },
        plugins: [
            json(),
            commonjs({
                include: 'node_modules/**'
            }),
            resolve()
        ],
        external: [
            'fs',
            'child_process',
            'console',
            'path',
            'module',
            'events',
            'assert',
            'os'
        ]
    }
];

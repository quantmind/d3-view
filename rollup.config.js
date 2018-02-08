import json from 'rollup-plugin-json';
import babel from 'rollup-plugin-babel';
import eslint from 'rollup-plugin-eslint';
import sourcemaps from 'rollup-plugin-sourcemaps';
import commonjs from 'rollup-plugin-commonjs';
import resolve from 'rollup-plugin-node-resolve';
import uglify from 'rollup-plugin-uglify';


const pkg = require('./package.json');
const external = Object.keys(pkg.dependencies).filter(d => d !== 'd3-require');
const globals = external.reduce((g, name) => {g[name] = 'd3'; return g;}, {});


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
            globals: globals
        },
        plugins: [
            json(),
            babel({
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
            format: 'umd',
            extend: true,
            sourcemap: true,
            name: 'd3',
            globals: globals
        },
        plugins: [
            json(),
            sourcemaps(),
            eslint({
                exclude: ['*.json', 'node_modules/**']
            }),
            resolve({
                browser: true
            })
        ]
    },
    {
        input: 'index.js',
        external: external,
        output: {
            file: 'build/d3-view.min.js',
            format: 'umd',
            extend: true,
            name: 'd3',
            globals: globals
        },
        plugins: [
            json(),
            resolve({
                browser: true
            }),
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
            resolve({
                browser: true
            }),
            babel({
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
            })
        ],
        external: [
            'fs',
            'child_process',
            'commander',
            'console',
            'path',
            'module',
            'events',
            'assert',
            'os'
        ]
    }
];

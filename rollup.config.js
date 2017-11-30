import json from 'rollup-plugin-json';
import babel from 'rollup-plugin-babel';
import sourcemaps from 'rollup-plugin-sourcemaps';
import commonjs from 'rollup-plugin-commonjs';
import resolve from 'rollup-plugin-node-resolve';


const pkg = require('./package.json');
const external = Object.keys(pkg.dependencies);


export default [
    {
        input: 'index.js',
        external: external,
        output: {
            file: 'build/d3-view.js',
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
            sourcemaps()
        ]
    },
    {
        input: 'src/require.js',
        output: {
            file: 'build/d3-require.js',
            format: 'umd',
            sourcemap: false,
            extend: true,
            name: 'd3'
        },
        plugins: [
            resolve()
        ]
    },
    {
        input: 'bin/src/index.js',
        output: {
			file: 'bin/view-require',
			format: 'cjs',
			banner: '#!/usr/bin/env node'
		},
        plugins: [
			//string({ include: '**/*.md' }),
			json(),
			//buble({ target: { node: 4 } }),
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

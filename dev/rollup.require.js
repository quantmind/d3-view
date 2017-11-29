import node from 'rollup-plugin-node-resolve';


export default {
    input: 'src/require.js',
    output: {
        file: 'build/d3-require.js',
        format: 'umd',
        sourcemap: false,
        extend: true,
        name: 'd3'
    },
    plugins: [
        node()
    ]
};

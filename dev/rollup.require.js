import node from 'rollup-plugin-node-resolve';
import sourcemaps from 'rollup-plugin-sourcemaps';


export default {
    input: 'src/require.js',
    output: {
        file: 'build/d3-require.js',
        format: 'umd',
        sourcemap: true,
        extend: true,
        name: 'd3'
    },
    plugins: [
        node(),
        sourcemaps()
    ]
};

const path = require('path');
const PWD = process.cwd();


module.exports = {
    entry: {
        js: './src/index.js'
    },
    output: {
        path: path.resolve(PWD, 'static'),
        filename: 'site.js'
    },
    devtool: 'source-map',
    resolve: {
        alias: {
            'handlebars' : 'handlebars/dist/handlebars.js'
        }
    },
    module: {
        rules: [
            {
                test: /\.js$/,
                exclude: /node_modules/,
                use: {
                    loader: 'babel-loader',
                    options: {
                        presets: ['es2015']
                    }
                }
            },
            {
                test: /\.html$/,
                use: 'raw-loader'
            },
            {
                test: /\.scss$/,
                include: /node_modules/,
                use: ['style-loader', 'sass-loader']
            }
        ]
    }
};

var HtmlWebpackPlugin = require('html-webpack-plugin');
var webpack = require('webpack');

module.exports = {
    entry: './frontend/app',
    output: {
        path: 'dist',
        filename: 'bundle.js'
    },
    resolve: {
        extensions: ['', '.ts', '.tsx', '.js']
    },
    module: {
        loaders: [
            { test: /\.less$/, loader: "style-loader!css-loader!less-loader" },
            // all files with a `.ts` or `.tsx` extension will be handled by `ts-loader`
            { test: /\.tsx?$/, loader: 'ts-loader' }
        ]
    },
    plugins: [
        new HtmlWebpackPlugin({
            title: 'Material Manager',
            hash: true,
        }),
        new webpack.ProvidePlugin({
            React: 'react',
        }),
    ],
    devServer: {
        proxy: {
            '/api': {
                target: 'http://localhost:3000',
                secure: false,
            }
        }
    }
}
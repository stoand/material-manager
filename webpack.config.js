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
            { test: /\.tsx?$/, loader: 'ts-loader?transpileOnly=true' }
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
        new webpack.DefinePlugin({
            PROXY: JSON.stringify(true),
        })
    ],
    devServer: {
        proxy: {
            '/api': {
                target: 'http://localhost:6666',
                secure: false,
            }
        }
    }
}
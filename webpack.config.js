const path = require('path');
const HWP = require('html-webpack-plugin');
module.exports = {
    entry: path.join(__dirname, '/src/index.js'),
    output: {
        filename: 'build.js',
        path: path.join(__dirname, '/dist'),
        publicPath: '/'
    },
    devServer: {
        historyApiFallback: true,
    },
    module:{
        rules:[{
           test: /\.js$/,
           exclude: /node_modules/,
           loader: 'babel-loader'
        }, {
            test: /\.s?css$/i,
            use: ['style-loader', 'css-loader', 'sass-loader'],
        }]
    },
    plugins:[
        new HWP(
           {template: path.join(__dirname, '/src/index.html')}
        )
    ]
 }

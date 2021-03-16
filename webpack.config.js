const webpack = require('webpack')
const path = require('path')

module.exports = {
    devtool: 'source-map', 
    entry: './src/app.js',  
    output: {
        path: path.join(__dirname, build),
        filename: 'bundle.js'
    },
    module: {
        rules: [
            {
                test: /\.js$/,
                exclude: /node_modules/,
                use: {
                    loader: 'babel-loader'
                }
            }
        ]
    }
}
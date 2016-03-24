var WebpackStrip = require('strip-loader');
var webpack = require('webpack');
var devConfig = require('./webpack.config.js');

var stripLoader = {
    test: [/\.js$/, /\.es6$/],
    exclude: /node_modules/,
    loader: WebpackStrip.loader('console.log', 'perfLog')
};

var uglifier = new webpack.optimize.UglifyJsPlugin({
    compress: {
        warnings: false
    },
    mangle: false
});

//Turn off dev-tool
devConfig.devtool = 'source-map';
//Remove the dev server config
devConfig.devServer= {};

//Change the entry to remove the hot-devserver
devConfig.entry = [
  './app.module'
];

// Push the strip loader into the dev loaders
devConfig.module.loaders.push(stripLoader);

// TODO: Fix annotations so we can remove this comment and uglify the code properly
// Push a plugin for minifying and uglifying the JS to the plugins object
devConfig.plugins.push(uglifier);

module.exports = devConfig;

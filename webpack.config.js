// NPM Module for helping to resolve paths
var path = require('path');
// Require the main webpack module to allow for chunking and commons
var webpack = require('webpack');
// Webpack Angular Annotate Plugin
var ngAnnotatePlugin = require('ng-annotate-webpack-plugin');
var ExtractTextPlugin = require("extract-text-webpack-plugin");
// Main Webpack Module
module.exports = {
    // Using eval source maps to increase speed of compiling.
     devtool: 'cheap-eval-source-map',
    // Setting main path context
    context: path.resolve('src/client/app/'),
    // Our main entry file
    entry: [
        './app.module'
    ],
    // Output of the transpiled JS
    output: {
        // The directory to output the js
        path: path.resolve('build/js/'),
        // Resolve the build path to the public folder
        publicPath: '/js/',
        // The name our main bundle
        filename: 'bundle.js'
    },
    // Plugins definition
    plugins: [
        new ExtractTextPlugin("styles.css"),
        new webpack.HotModuleReplacementPlugin(),
        new webpack.NoErrorsPlugin(),
        new webpack.optimize.DedupePlugin(),
        new webpack.ProvidePlugin({
            $: "jquery",
            jQuery: "jquery",
            "window.jQuery": "jquery"
        }),
        new webpack.DefinePlugin({
            ON_TEST: process.env.NODE_ENV === 'test'
        }),
        new webpack.DefinePlugin({
            ON_PROD: process.env.NODE_ENV === 'production'
        }),
        new ngAnnotatePlugin({
            add: true
            // other ng-annotate options here
        })
    ],
    // Setting the main public folder for the dev-server only not really necessary since middleware will override this.
    // This also contains a proxy for us to call the middleware when needed.
    devServer: {
        port: 3000,
        contentBase: 'src/client',
        historyApiFallback: true
    },
    // Here is the loaders and preloaders
    module: {
        // Preloaders for hinting and linting
        preLoaders: [
            {
                // which files need to be hinted or linted
                test: /\.js$/,
                // always exlude the node_modules directory
                exclude: /node_modules/,
                // use the jshint loader for this
                loader: 'jshint-loader'
            }
        ],
        // Loaders for transpiling code like ES6 and SASS
        loaders: [
            {
                // which files need to be transpiled
                test: /\.(es6|js)$/,
                // always exclude the node_modules directory
                exclude: /node_module/,
                // using the babel-loader for this task then after run that through the ng-annotate loader which provides annotations for us.
                loader: 'babel',

                query: {compact: false}
            },
            // CSS Loader for loading Styles
            {
                // Apply this loader to all CSS Files
                test: /\.css$/,
                // Never include the node_modules Directory
                exclude: /node_modules/,
                loader: ExtractTextPlugin.extract("style-loader", "css-loader")
                // Bang indicates first use Style-loader then run it through the CSS Loader
                // loader: 'style!css!autoprefixer'
            },
            // SASS Loader for compiling SCSS to CSS
            {
                test: /\.scss$/,
                loader: 'style!css!autoprefixer!sass'
            },
            // Font and image loader
            {
                // Types of files to test for to apply this loader to
                test: /\.(png|jpe?g$|ttf|eot|woff|woff2|svg)$/,
                // Never Inlcude node_modules
                exclude: /node_modules/,
                // TODO: PERF discussion
                loader:'url?limit=100000'
            },
            // Raw loader to allow for HTML template imports
            {
                // Run this loader for all HTML files
                test: /\.html$/,
                // Never Include node_modules
                exclude: /node_modules/,
                // Using the raw loader to process html files
                loader: 'raw'
            }
        ]
    },
    sassLoader: {
      includePaths: [path.resolve(__dirname, './src/app'), path.resolve(__dirname, '/node_modules/angular-material')]
    },
    // Resolves so require statements don't need extentions
    resolve: {
        extensions: ['', '.js', '.es6', '.scss', '.css', '.html', '.json'],
        alias: {
          angular_material_scss: __dirname + "/node_modules/angular-material/angular-material.scss"
        }
    }
};

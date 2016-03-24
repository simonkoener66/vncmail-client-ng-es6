var path = require('path');
var webpackConfig = require('./webpack.config');
var entry = path.resolve(webpackConfig.context.toString(), webpackConfig.entry.toString());

var preprocessors = {};

var coverageDir = './report/coverage';

module.exports = function(config) {

    config.set({
        // base path that will be used to resolve all patterns (eg. files, exclude)
        basePath: './',

        // frameworks to use
        // some available frameworks: https://npmjs.org/browse/keyword/karma-adapter
        frameworks: ['mocha', 'chai', 'chai-jquery', 'jquery-1.8.3', 'sinon', 'chai-sinon'],

        // Using the webpack entry file.
        files: [{ pattern: 'spec.bundle.js', watched: false }],

        // Load in the config for webpack Karma
        webpack: webpackConfig,
        // list of files to exclude
        exclude: [],

        // proxies: {
        //     '/': 'http://localhost:3000'
        // },

        // preprocess matching files before serving them to the browser
        // available preprocessors: https://npmjs.org/browse/keyword/karma-preprocessor
         preprocessors: {
             'spec.bundle.js': ['webpack', 'coverage']
            },

        // test results reporter to use
        // possible values: 'dots', 'progress', 'coverage'
        // available reporters: https://npmjs.org/browse/keyword/karma-reporter
        reporters: ['progress', 'coverage', 'jenkins'],

        coverageReporter: {
            dir: coverageDir,
            reporters: [
                // reporters not supporting the `file` property
              { type: 'lcov', subdir: '.' },
              { type: 'text-summary' },
              { type: 'text' },
              { type: 'cobertura', subdir: '.', file: 'coverage.xml' },
              {type: 'html', subdir: 'report-html'}
            ]
        },

        jenkinsReporter: {
          outputFile: 'report/test-results.xml',
          suite: 'vnc-vncuxf-frontend-app',
          classnameSuffix: 'browser-test'
        },

        // web server port
        port: 9876,

        // enable / disable colors in the output (reporters and logs)
        colors: true,

        // level of logging
        // possible values: config.LOG_DISABLE || config.LOG_ERROR ||
        // config.LOG_WARN || config.LOG_INFO || config.LOG_DEBUG
        // logLevel: config.LOG_INFO,

        // enable / disable watching file and executing tests whenever any file changes
        autoWatch: false,

        // start these browsers
        // available browser launchers: https://npmjs.org/browse/keyword/karma-launcher
        //        browsers: ['Chrome', 'ChromeCanary', 'FirefoxAurora', 'Safari', 'PhantomJS'],
        browsers: ['PhantomJS'],

        // Continuous Integration mode
        // if true, Karma captures browsers, runs the tests and exits
        singleRun: true,

        //Specify Plugins
        plugins: [
             require('karma-webpack'),
            'karma-chai',
            'karma-chai-jquery',
            'karma-chai-sinon',
            'karma-jquery',
            'karma-sinon',
            'karma-mocha',
            'karma-coverage',
            'karma-jenkins-reporter',
            'karma-firefox-launcher',
            'karma-growl-reporter',
            'karma-phantomjs-launcher',
            'karma-safari-launcher',
            'karma-chrome-launcher'
             // 'bardjs',
        ],
        // Hide webpack build information from output
        webpackMiddleware: {
          noInfo: true
        }
    });
};

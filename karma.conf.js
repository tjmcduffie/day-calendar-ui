/*jshint indent:2*/
/*global module:false grunt:true*/
// Karma configuration
// Generated on Sun Sep 28 2014 23:06:03 GMT-0400 (EDT)

module.exports = function(config) {
  'use strict';

  config.set({

    // base path that will be used to resolve all patterns (eg. files, exclude)
    basePath: '',


    // frameworks to use
    // available frameworks: https://npmjs.org/browse/keyword/karma-adapter
    frameworks: ['jasmine-ajax', 'jasmine'],


    // list of files / patterns to load in the browser
    files: [
      'public/js/polyfill/function.js',
      'public/js/lib/TMCD.js',
      'public/js/lib/Logger.js',
      'public/js/lib/EventEmitter.js',
      'public/js/lib/CalendarEvent.js',
      'public/js/lib/DayView.js',
      'public/js/lib/Calendar.js',
      'spec/unit/{,**/}*.js'
    ],


    // list of files to exclude
    exclude: [
    ],


    // preprocess matching files before serving them to the browser
    // available preprocessors: https://npmjs.org/browse/keyword/karma-preprocessor
    preprocessors: {
      'public/js/{,lib/**/}*.js': ['coverage']
    },


    // test results reporter to use
    // possible values: 'dots', 'progress'
    // available reporters: https://npmjs.org/browse/keyword/karma-reporter
    reporters: ['progress', 'coverage', 'html'],

    coverageReporter: {
      type : 'html',
      dir : 'reports/coverage/'
    },

    // the default configuration
    htmlReporter: {
      outputDir: 'reports/tests'
    },

    // web server port
    port: 9876,


    // enable / disable colors in the output (reporters and logs)
    colors: true,


    // level of logging
    // possible values: config.LOG_DISABLE || config.LOG_ERROR || config.LOG_WARN || config.LOG_INFO || config.LOG_DEBUG
    logLevel: config.LOG_INFO,


    // enable / disable watching file and executing tests whenever any file changes
    autoWatch: false,


    // start these browsers
    // available browser launchers: https://npmjs.org/browse/keyword/karma-launcher
    browsers: [],


    // Continuous Integration mode
    // if true, Karma captures browsers, runs the tests and exits
    singleRun: true
  });
};

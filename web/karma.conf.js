'use strict';

module.exports = function (config) {
    config.set({
        frameworks: ['jspm', 'jasmine'],
        files: ['node_modules/jasmine-async-sugar/jasmine-async-sugar.js'],
        jspm: {
            loadFiles: ['test/scripts/**/*.js', 'src/scripts/**/*.js'],
            serveFiles: ['src/scripts/*.js', 'src/scripts/**/*.js']
        },
        browsers: ['PhantomJS']
    });
};

'use strict';

module.exports = function (config) {
    config.set({
        frameworks: ['jspm', 'jasmine'],
        jspm: {
            loadFiles: ['test/scripts/**/*.js'],
            serveFiles: ['src/scripts/**/*.js']
        },
        browsers: ['PhantomJS']
    });
};

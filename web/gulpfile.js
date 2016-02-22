/*global require: true*/
/*global __dirname: true*/
/*global __filename: true*/

'use strict';

var argv = require('yargs').argv,
    gulp = require('gulp'),
    gulpIf = require('gulp-if'),
    flatten = require('gulp-flatten'),
    jspm = require('gulp-jspm'),
    clean = require('gulp-clean'),
    sass = require('gulp-sass'),
    sourcemaps = require('gulp-sourcemaps'),
    uglify = require('gulp-uglify'),
    minifyCss = require('gulp-minify-css'),
    connect = require('gulp-connect'),
    watch = require('gulp-watch'),
    runSequence = require('run-sequence'),
    gulpOpen = require('gulp-open'),
    KarmaServer = require('karma').Server;

var paths = {
    'tmp': '.tmp',
    'dist': 'dist'
};

/************* Sub tasks *************/

gulp.task('clean:tmp', function () {
    return gulp.src(paths.tmp, {'read': false})
        .pipe(clean());
});

gulp.task('clean:dist', function () {
    return gulp.src(paths.dist, {'read': false})
        .pipe(clean());
});

gulp.task('webserver', function () {
    return connect.server({
        'livereload': true,
        'root': [__dirname, paths.tmp],
        'port': 8181
    });
});

gulp.task('livereload', function () {
    return gulp.src([paths.tmp + '/styles/**/*.css', paths.tmp + '/scripts/**/*.js', paths.tmp + '/*.html'])
        .pipe(watch([paths.tmp + '/styles/**/*.css', paths.tmp + '/scripts/**/*.js', paths.tmp + '/*.html']))
        .pipe(connect.reload());
});

gulp.task('sass', function () {
    return gulp.src('src/styles/main.scss')
        .pipe(sass())
        .pipe(minifyCss())
        .pipe(gulpIf(argv.production, gulp.dest(paths.dist + '/styles'), gulp.dest(paths.tmp + '/styles')));
});

gulp.task('build', function () {
    return gulp.src('src/scripts/main.js')
        .pipe(gulpIf(!argv.production, sourcemaps.init()))
        .pipe(jspm({ selfExecutingBundle: true }))
        .pipe(uglify())
        .pipe(gulpIf(!argv.production, sourcemaps.write('.')))
        .pipe(gulpIf(argv.production, gulp.dest(paths.dist + '/scripts'), gulp.dest(paths.tmp + '/scripts')));
});

gulp.task('copy:html', function () {
    return gulp.src(['src/index.html', 'src/**/*.html'])
        .pipe(gulpIf(argv.production, gulp.dest(paths.dist), gulp.dest(paths.tmp)));
});

gulp.task('copy:locales', function () {
    return gulp.src(['src/locales/*'])
        .pipe(gulpIf(argv.production, gulp.dest(paths.dist + '/locales'), gulp.dest(paths.tmp + '/locales')));
});

gulp.task('copy:js', function () {
    return gulp.src(['jspm_packages/system.js'])
        .pipe(gulpIf(argv.production, gulp.dest(paths.dist + '/scripts'), gulp.dest(paths.tmp + '/scripts')));
});

gulp.task('copy:fonts', function () {
    return gulp.src(['jspm_packages/npm/roboto-fontface*/fonts/*'])
        .pipe(flatten())
        .pipe(gulpIf(argv.production, gulp.dest(paths.dist + '/fonts'), gulp.dest(paths.tmp + '/fonts')));
});

gulp.task('watch', function () {
    gulp.watch('src/styles/**/*.scss', ['sass']);
    gulp.watch(['src/*.html', 'src/**/*.html'], ['copy:html']);
    gulp.watch(['src/locales/*'], ['copy:locales']);
    gulp.watch(['src/scripts/*.js', 'src/scripts/**/*.js'], ['build']);
});

gulp.task('open', function () {
    gulp.src(__filename)
        .pipe(gulpOpen({'uri': 'http://localhost:8181'}));
});

/************* Main tasks *************/

gulp.task('serve',
    function () {
        return runSequence(
            'clean:tmp',
            'sass',
            'build',
            [
                'copy:html',
                'copy:js',
                'copy:locales',
                'copy:fonts'
            ],
            'webserver',
            [
                'open',
                'livereload',
                'watch'
            ]
        );
    }
);

gulp.task('default',
    function () {
        var cleanTask = argv.production ? 'clean:dist' : 'clean:tmp';

        return runSequence(
            cleanTask,
            'sass',
            'build',
            [
                'copy:html',
                'copy:js',
                'copy:locales',
                'copy:fonts'
            ]
        );
    }
);

gulp.task('test',
    function (done) {
        new KarmaServer({
            configFile: __dirname + '/karma.conf.js',
            singleRun: true
        }, done).start();
    }
);

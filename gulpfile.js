var gulp = require('gulp'),
    del = require('del'),
    header = require('gulp-header'),
    preprocess = require('gulp-preprocess'),
    template = require('gulp-template'),
    rename = require('gulp-rename'),
    map = require('map-stream'),
    sourcemaps = require('gulp-sourcemaps'),
    uglify = require('gulp-uglify'),
    p = require('./package.json'),
    eslint = require('gulp-eslint'),
    babel = require('gulp-babel'),
    umd = require('gulp-umd');

var banner =
'/*!\n' +
' * DrizzleJS v' + p.version + '\n' +
' * -------------------------------------\n' +
' * Copyright (c) ' + (new Date().getFullYear()) + ' Jaco Koo <jaco.koo@guyong.in>\n' +
' * Distributed under MIT license\n' +
' */\n\n';

var trimTrailingSpaces = function(file, cb) {
    file.contents = new Buffer(String(file.contents).replace(/[ \t]+\n/g, '\n').replace(/\n+$/g, '\n'));
    cb(null, file);
}

gulp.task('clean', function(cb) { del(['dist'], cb) });

gulp.task('build', ['clean'], function() {
    return gulp.src('es6/drizzle.js')
        .pipe(preprocess())
        .pipe(header(banner))
        .pipe(map(trimTrailingSpaces))
        .pipe(eslint())
        .pipe(eslint.format())
        .pipe(rename('drizzle.es6.js'))
        .pipe(gulp.dest('dist'))
        .pipe(rename('drizzle.js'))
        .pipe(babel({presets: ['es2015']}))
        .pipe(umd({exports: function() { return 'Drizzle';}}))
        .pipe(gulp.dest('dist'))
        .pipe(rename('drizzle.min.js'))
        .pipe(uglify({
            preserveComments: 'some',
            output: { max_line_len: 500, ascii_only: true }
        }))
        .pipe(sourcemaps.init())
        .pipe(sourcemaps.write('.'))
        .pipe(gulp.dest('dist'));
});

gulp.task('default', ['build']);

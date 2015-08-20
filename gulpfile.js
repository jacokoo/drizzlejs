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
    eslint = require('gulp-eslint');

var banner =
'/*!\n' +
' * DrizzleJS v' + p.version + '\n' +
' * -------------------------------------\n' +
' * Copyright (c) ' + (new Date().getFullYear()) + ' Jaco Koo <jaco.koo@guyong.in>\n' +
' * Distributed under MIT license\n' +
' */\n\n';

var trimTrailingSpaces = function(file, cb) {
    file.contents = new Buffer(String(file.contents).replace(/[ \t]+\n/g, '\n'));
    cb(null, file);
}

gulp.task('clean', function(cb) { del(['dist'], cb) });

gulp.task('build', ['clean'], function() {
    return gulp.src('src/drizzle.js')
        .pipe(template({ version: p.version }))
        .pipe(preprocess())
        .pipe(header(banner))
        .pipe(map(trimTrailingSpaces))
        .pipe(eslint())
        .pipe(eslint.format())
        .pipe(gulp.dest('dist'))
        .pipe(rename('drizzle.min.js'))
        .pipe(uglify({ preserveComments: 'some' }))
        .pipe(sourcemaps.init())
        .pipe(sourcemaps.write('.'))
        .pipe(gulp.dest('dist'));
});

gulp.task('jquery-adapter', ['clean'], function() {
    return gulp.src('src/util/jquery-adapter.js')
        .pipe(header(banner))
        .pipe(map(trimTrailingSpaces))
        .pipe(eslint())
        .pipe(eslint.format())
        .pipe(gulp.dest('dist'))
        .pipe(rename('jquery-adapter.min.js'))
        .pipe(uglify({ preserveComments: 'some' }))
        .pipe(sourcemaps.init())
        .pipe(sourcemaps.write('.'))
        .pipe(gulp.dest('dist'));
});

gulp.task('default', ['build', 'jquery-adapter']);

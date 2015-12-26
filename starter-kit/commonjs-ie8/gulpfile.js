'use strict';

var fs = require('fs'),
    path = require('path'),
    del = require('del'),
    watchify = require('watchify'),
    browserify = require('browserify'),
    gulp = require('gulp'),
    source = require('vinyl-source-stream'),
    buffer = require('vinyl-buffer'),
    gutil = require('gulp-util'),
    sourcemaps = require('gulp-sourcemaps'),
    express = require('express'),
    handlebars = require('gulp-handlebars'),
    imagemin = require('gulp-imagemin'),
    rev = require('gulp-rev'),
    revReplace = require('gulp-rev-replace'),
    useref = require('gulp-useref'),
    filter = require('gulp-filter'),
    csso = require('gulp-csso'),
    uglify = require('gulp-uglify'),
    htmlmin = require('gulp-htmlmin'),
    sleet = require('gulp-sleet'),
    eslint = require('gulp-eslint');

var libs = [
        'jquery', 'handlebars/runtime', 'lodash/collection'
    ],
    options = {
        entries: ['./main.js'],
        extensions: ['.html', '.hbs'],
        basedir: './scripts',
        debug: false,
        cache: {}, packageCache: {}
    },
    requireDrizzleModules = function(dir, root, b) {
        fs.readdirSync(dir).forEach(function(file) {
            var filename = path.join(dir, file), ext;
            if (fs.statSync(filename).isDirectory()) {
                requireDrizzleModules(filename, root, b);
            } else {
                ext = path.extname(filename);
                if (ext === '.js' || ext === '.hbs' || ext === '.html') {
                    filename = path.relative(root, filename)
                    filename = path.join(path.dirname(filename), path.basename(filename, ext));
                    b.require('./' + filename.replace(/\\/g, '/'), {basedir: root});
                }
            }
        });
    },
    main = function() {
        var b = watchify(browserify(options));
        b.on('update', main);
        b.on('log', gutil.log);
        requireDrizzleModules('./scripts/app', './scripts', b);

        b.external(libs);
        gulp.run('lint');

        return b.bundle()
            .on('error', gutil.log.bind(gutil, 'Browserify Error'))
            .pipe(source('main.js'))
            .pipe(buffer())
            .pipe(sourcemaps.init({loadMaps: true}))
            .pipe(sourcemaps.write('./'))
            .pipe(gulp.dest('./bundle'));
    };

gulp.task('lint', function() {
    gulp.src('scripts/**/*.js')
        .pipe(eslint())
        .pipe(eslint.format());
});

gulp.task('common', function() {
    var b = browserify();
    b.require(libs);

    b.bundle()
        .pipe(source('common.js'))
        .pipe(buffer())
        .pipe(sourcemaps.init({loadMaps: true}))
        .pipe(sourcemaps.write('./'))
        .pipe(gulp.dest('./bundle'))
});

gulp.task('build-main', function() {
    var b = browserify(options);
    requireDrizzleModules('./scripts/app', './scripts', b);

    b.external(libs);

    return b.bundle()
        .on('error', gutil.log.bind(gutil, 'Browserify Error'))
        .pipe(source('main.js'))
        .pipe(buffer())
        .pipe(sourcemaps.init({loadMaps: true}))
        .pipe(sourcemaps.write('./'))
        .pipe(gulp.dest('./bundle'));
});

gulp.task('main', main);

gulp.task('sleet', function() {
    gulp.src('./**/*.sleet')
        .pipe(sleet())
        .pipe(gulp.dest('./'));
});

gulp.task('clean-build', function(cb) {
    del(['./dist'], cb);
});

gulp.task('images', ['clean-build'], function() {
    gulp.src('images/**')
        .pipe(imagemin())
        .pipe(gulp.dest('dist/images'));

});

gulp.task('build', ['clean-build', 'lint', 'common', 'build-main', 'images'], function() {
    var jsFilter = filter('**/*.js'),
        cssFilter = filter('**/*.css'),
        htmlFilter = filter('**/*.html'),
        userefAssets = useref.assets();

        gulp.src('./index.html')
            .pipe(userefAssets)
            .pipe(jsFilter)
            .pipe(uglify())
            .pipe(jsFilter.restore())
            .pipe(cssFilter)
            .pipe(csso())
            .pipe(cssFilter.restore())
            .pipe(rev())
            .pipe(userefAssets.restore())
            .pipe(useref())
            .pipe(revReplace())
            .pipe(htmlFilter)
            .pipe(htmlmin())
            .pipe(htmlFilter.restore())
            .pipe(gulp.dest('dist'));
});

gulp.task('default', ['main', 'common'], function() {
    var app = express()

    app.use(function(req, res, next) {
        console.log('Request URL:', req.originalUrl);
        next();
    });
    app.use(express.static('.'));

    app.listen(8000, function() {
        console.log('Server started at localhost:8000');
    });

})

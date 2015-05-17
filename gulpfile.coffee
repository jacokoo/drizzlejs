fs = require 'fs'

p = require './package.json'
gulp = require 'gulp'
header = require 'gulp-header'
preprocess = require 'gulp-preprocess'
template = require 'gulp-template'
clean = require 'gulp-clean'
rename = require 'gulp-rename'
map = require 'map-stream'
coffeelint = require 'gulp-coffeelint'
coffee = require 'gulp-coffee'
sourcemaps = require 'gulp-sourcemaps'
uglify = require 'gulp-uglify'
bower = require 'gulp-bower'
connect = require 'gulp-connect'

banner = """
    ###!
    # DrizzleJS v#{p.version}
    # -------------------------------------
    # Copyright (c) #{new Date().getFullYear()} Jaco Koo <jaco.koo@guyong.in>
    # Distributed under MIT license
    ###\n\n
"""

trimtrailingspaces = (file, cb) ->
    file.contents = new Buffer(String(file.contents).replace /[ \t]+\n/g, '\n')
    cb null, file

gulp.task 'clean', ->
    gulp.src('dist').pipe(clean())

gulp.task 'generate-coffee-files', ['clean'], ->
    gulp.src('src/drizzle.coffee')
        .pipe(template version: p.version)
        .pipe preprocess()
        .pipe header banner
        .pipe map trimtrailingspaces
        .pipe rename 'drizzle.coffee'
        .pipe gulp.dest 'dist'

gulp.task 'generate-source-map', ['generate-coffee-files'], ->
    gulp.src('dist/*.coffee')
        .pipe coffeelint '.coffeelint'
        .pipe coffeelint.reporter()
        .pipe sourcemaps.init()
        .pipe coffee bare: true
        .pipe gulp.dest 'dist'
        .pipe sourcemaps.write('.')
        .pipe gulp.dest 'dist'

gulp.task 'generate-dist-files', ['generate-source-map'], ->

    gulp.src('dist/drizzle.js')
        .pipe uglify(preserveComments: 'some')
        .pipe rename 'drizzle.min.js'
        .pipe gulp.dest 'dist'

gulp.task 'build', ['generate-dist-files']

gulp.task 'default', ['build']

gulp.task 'clean-demo', ->
    gulp.src(['demo/scripts/**/*.js', 'demo/scripts/drizzlejs'])
        .pipe clean()

gulp.task 'demo', ['build', 'clean-demo'], ->
    gulp.src('dist/*', base: 'dist').pipe(gulp.dest('demo/scripts/drizzlejs'))
    gulp.src('demo/scripts/**/*.coffee').pipe(coffee()).pipe(gulp.dest 'demo/scripts')

    unless fs.existsSync 'demo/bower_components'
        bower(cwd: 'demo').pipe(gulp.dest('demo/bower_components'))

    connect.server
        root: 'demo'
        port: 8000

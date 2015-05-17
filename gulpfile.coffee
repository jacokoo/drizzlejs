fs = require 'fs'

p = require './package.json'
gulp = require 'gulp'
del = require 'del'
header = require 'gulp-header'
preprocess = require 'gulp-preprocess'
template = require 'gulp-template'
rename = require 'gulp-rename'
map = require 'map-stream'
coffeelint = require 'gulp-coffeelint'
coffee = require 'gulp-coffee'
sourcemaps = require 'gulp-sourcemaps'
uglify = require 'gulp-uglify'

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

gulp.task 'clean', (cb) -> del ['dist'], cb

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

fs = require 'fs'
path = require 'path'

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

# utility functions
getArg = (key) ->
    index = process.argv.indexOf key
    next = process.argv[index + 1]
    if index < 0 then null else if next and next[0] is '-' then true else next

unixifyPath = (filepath) ->
    if process.platform is 'win32' then filepath.replace(/\\/g, '/') else filepath

recurse = (rootdir, callback, subdir) ->
    abspath = if subdir then path.join(rootdir, subdir) else rootdir
    fs.readdirSync(abspath).forEach (filename) ->
        filepath = path.join(abspath, filename)
        if fs.statSync(filepath).isDirectory()
            recurse(rootdir, callback, unixifyPath(path.join(subdir or '', filename or '')))
        else
            callback(unixifyPath(filepath), rootdir, subdir, filename)

# ext modules
exts =
    all: []
    specified: []
# recurse 'src/ext', (..., file) -> exts.all.push "    # @include ext/#{file}"

extSpecified = getArg '--ext'
if extSpecified and extSpecified isnt true
    exts.specified.push "    # @include ext/#{ext}.coffee" for ext in extSpecified.split ',' when ext

gulp.task 'demo', ->
    console.dir exts

trimtrailingspaces = (file, cb) ->
    file.contents = new Buffer(String(file.contents).replace /[ \t]+\n/g, '\n')
    cb null, file

gulp.task 'clean', ->
    gulp.src('dist').pipe(clean())

gulp.task 'generate-coffee-files', ['clean'], ->
    gulp.src('src/drizzle.coffee')
        .pipe(template extModules: exts.all, version: p.version)
        .pipe preprocess()
        .pipe header banner
        .pipe map trimtrailingspaces
        .pipe rename 'drizzle-all.coffee'
        .pipe gulp.dest 'dist'

    gulp.src('src/drizzle.coffee')
        .pipe(template extModules: exts.specified, version: p.version)
        .pipe header banner
        .pipe preprocess()
        .pipe map trimtrailingspaces
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
    gulp.src('dist/drizzle-all.js')
        .pipe uglify(preserveComments: 'some')
        .pipe rename 'drizzle-all.min.js'
        .pipe gulp.dest 'dist'

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

const fs = require('fs')
const path = require('path')
const browserify = require('browserify')
const watchify = require('watchify')
const source = require('vinyl-source-stream')
const gulp = require('gulp')
const eslint = require('gulp-eslint')
const {CLIEngine} = require('eslint')
const express = require('express')
const jsonServer = require('json-server')

const libs = ['drizzlejs', 'handlebars/runtime']

const walker = (dir, root, filter, result) => {
    fs.readdirSync(dir).forEach(file => {
        let filename = path.join(dir, file)
        if (fs.statSync(filename).isDirectory()) walker(filename, root, filter, result)
        else if (filter(file, filename)) result.push(path.relative(root, filename))
    })
}

const walk = (dir, root, filter, withExt) => {
    let result = []
    walker(dir, root, filter, result)
    result = result.map(it => it.replace(/\\/g, '/'))
    if (withExt) return result.map(it => `./${it}`)
    else  return result.map(it => `./${it.slice(0, it.lastIndexOf('.'))}`)
}

const requireDrizzleModules = (dir, root, b) => {
    walk(dir, root, name => {
        const ext = path.extname(name)
        return ext === '.js' || ext === '.hbs' || ext === '.html'
    }).forEach(file => b.require({file}, {basedir: root}))
}

const common = browserify({debug: true})
common.require(libs)

let main = watchify(browserify(Object.assign({
    extensions: ['.hbs', '.html'],
    entries: ['./main.js'],
    basedir: './scripts'
}, watchify.args)))

main.external(libs)
main.on('log', console.log)
requireDrizzleModules('./scripts/app', './scripts', main)

main.updateIt = () => main.bundle().on('error', console.log).pipe(source('main.js')).pipe(gulp.dest('./build'))

const cli = new CLIEngine()
const formatter = cli.getFormatter()
main.on('update', files => {
    console.log(formatter(cli.executeOnFiles(files).results))
    main.updateIt()
})

gulp.task('common', () => {
    return common.bundle()
        .on('error', console.log)
        .pipe(source('common.js'))
        .pipe(gulp.dest('./build'))
})

gulp.task('main', main.updateIt)

gulp.task('lint', () => {
    return gulp.src('./scripts/**/*.js')
        .pipe(eslint())
        .pipe(eslint.format())
})

gulp.task('watch-lint', () => {
    gulp.watch('./scripts/**/*.js', gulp.series('lint'))
})

gulp.task('default', gulp.series('common', 'main', 'lint', () => {
    const app = express()
    const server = jsonServer.create()

    server.use(jsonServer.defaults())
    server.use(jsonServer.router('data/todos.json'))

    app.use(express.static('.'))
    app.use('/api', server);
    app.listen(8000, () => console.log('started at localhost:8000'))
}))

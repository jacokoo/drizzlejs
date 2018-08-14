import babel from 'rollup-plugin-babel'
import commonjs from 'rollup-plugin-commonjs'
import drizzle from './rollup-plugin-drizzle'

export default {
    input: 'scripts/main.js',
    external: ['drizzlejs'],
    plugins: [
        commonjs({
            include: ['../dist/drizzle.js'],
            namedExports: {
                '../dist/drizzle.js': ['factory', 'ModuleTemplate', 'ViewTemplate', 'Application', 'Loader']
            }
        }),
        drizzle({scriptRoot: 'app'}),
        babel({
            babelrc: false,
            presets: ['es2015-rollup']
        })
    ],
    output: {
        file: 'dist/bundle.js',
        format: 'iife',
        name: 'main',
        sourcemap: true
    }
}

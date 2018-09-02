import babel from 'rollup-plugin-babel'
import commonjs from 'rollup-plugin-commonjs'
import drizzle from './rollup-plugin-drizzle'
import resolve from 'rollup-plugin-node-resolve'

export default {
    input: 'scripts/main.js',
    external: ['drizzlejs', 'sleet'],
    plugins: [
        {
            resolveId (id, name) {
                console.log(id, name)
            }
        },
        drizzle({scriptRoot: 'app'}),
        resolve(),
        commonjs({
            include: 'node_modules/**',
            namedExports: {
                'drizzlejs': ['factory', 'ModuleTemplate', 'ViewTemplate', 'Application', 'Loader']
            }
        }),
        babel({
            babelrc: false,
            presets: ['es2015-rollup']
        })
    ],
    output: {
        file: 'dist/bundle.js',
        format: 'iife',
        name: 'main',
        sourcemap: true,
        globals: {
            sleet: 'Sleet',
            drizzlejs: 'Drizzle'
        }
    }
}

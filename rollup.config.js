import typescript from 'rollup-plugin-typescript'
import babel from 'rollup-plugin-babel'
import tslint from 'rollup-plugin-tslint'
import { uglify } from 'rollup-plugin-uglify'

export default {
    input: 'src/drizzle.ts',
    plugins: [
        tslint({throwError: false}),
        typescript({
            include: 'src/**',
            typescript: require('typescript')
        }),
        babel({
            babelrc: false,
            presets: ['es2015-rollup']
	}),
	uglify()
    ],

    output: {
        file: 'dist/drizzle.js',
        format: 'umd',
        name: 'Drizzle',
        sourcemap: true
    }
}

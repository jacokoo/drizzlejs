import typescript from 'rollup-plugin-typescript'
import babel from 'rollup-plugin-babel'
import tslint from 'rollup-plugin-tslint'

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
        })
    ],

    output: {
        file: 'dist/drizzle.js',
        format: 'umd',
        name: 'drizzlejs',
        sourcemap: true
    }
}

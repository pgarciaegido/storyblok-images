import babel from 'rollup-plugin-babel'
import { terser } from 'rollup-plugin-terser'
import commonjs from 'rollup-plugin-commonjs'

export default {
  input: 'src/index.js',
  output: {
    file: 'dist/index.js',
    format: 'umd',
    name: 'storyblockImages',
  },
  plugins: [
    commonjs(),
    babel({
      exclude: 'node_modules/**',
    }),
    terser(),
  ],
}

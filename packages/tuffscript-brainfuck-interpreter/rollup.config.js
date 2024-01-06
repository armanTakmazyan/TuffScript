const resolve = require('@rollup/plugin-node-resolve');
const commonjs = require('@rollup/plugin-commonjs');

module.exports = {
  input: './lib/index.js',
  output: {
    file: './lib/index.js',
    format: 'cjs'
  },
  plugins: [resolve(), commonjs()],
};
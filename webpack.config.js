const path = require('path');
const glob = require('glob');
const _ = require('lodash');
const LiveReloadPlugin = require('webpack-livereload-plugin');
const nodeExternals = require('webpack-node-externals');

const jsDistPath = path.resolve(__dirname, 'dist');
const jsSrcPath = path.resolve(__dirname, 'src');
const targets = _.filter(glob.sync(`${jsSrcPath}/**/*.js`), item => item);
const entries = {};
targets.forEach(value => {
  const re = new RegExp(`${jsSrcPath}/`);
  const key = value.replace(re, '');
  entries[key] = value;
});

module.exports = {
  entry: entries,
  output: {
    filename: '[name]',
    path: jsDistPath,
    libraryTarget: 'commonjs-module',
  },
  target: 'node',
  externals: [nodeExternals()],
  module: {
    rules: [
      {
        loader: 'babel-loader',
        exclude: /node_modules/,
        test: /\.js$/,
        options: {
          presets: [['es2015'], 'stage-0', 'stage-1', 'stage-2'],
          plugins: ['transform-runtime'],
        },
      },
    ],
  },
  plugins: [new LiveReloadPlugin()],
};

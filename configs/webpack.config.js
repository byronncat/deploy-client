const path = require('path');
const { compilerOptions } = require('../tsconfig.json');

const paths = compilerOptions.paths;

const alias = Object.keys(paths).reduce(
  (acc, key) => {
    const value = paths[key][0];
    const name = key.replace('/*', '');
    acc[name] = path.resolve(__dirname, '..', value.replace('/*', ''));
    return acc;
  },
  {},
);

const config = {
  alias,
  extension: ['.sass', '.ts', '.tsx'],
  test: /\.tsx?$/,
  exclude: /\.test.tsx?$/,
  use: 'awesome-typescript-loader?silent=true',
};

module.exports = config
const webpackConfig = require('./webpack.config');
const jestConfig = require('./jest.config');
const eslintConfig = require('./eslint.config');
const postcssConfig = require('./postcss.config');

const config = {
  webpack: webpackConfig,
  jest: {
    configure: jestConfig,
  },
  eslint: {
    configure: eslintConfig,
  },
  style: {
    postcssOptions: postcssConfig,
  },
};

module.exports = config
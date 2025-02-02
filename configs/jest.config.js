const { compilerOptions } = require('../tsconfig.json');

const paths = compilerOptions.paths;

const moduleNameMapper = Object.keys(compilerOptions.paths).reduce(
  (acc, key) => {
    const value = paths[key][0];
    const name = key.replace('/*', '/(.*)$');
    acc[name] = `<rootDir>/${value.replace('/*', '/$1')}`;
    return acc;
  },
  {
    '^axios$': 'axios/dist/node/axios.cjs',
    '\\.(css|less|scss|sass)$': 'identity-obj-proxy',
    '^.+\\.module\\.(css|sass|scss)$': 'identity-obj-proxy',
  },
);

const config = {
  setupFilesAfterEnv: ['<rootDir>/src/setupTests.ts'],
  testEnvironment: 'jsdom',
  collectCoverageFrom: [
    'src/**/*.{js,jsx,ts,tsx}',
    '!src/**/*.d.ts',
    '!**/index.{tsx,ts}',
    '!src/**/{constants,libraries,route}/**',
    '!src/{setupTests.ts,reportWebVitals.ts,setupProxy.js}',
  ],
  moduleNameMapper,
  transform: {
    '^.+\\.(ts|tsx|js|jsx)$': 'ts-jest',
  },
  transformIgnorePatterns: [
    '[/\\\\]node_modules[/\\\\].+\\.(js|jsx|mjs|cjs|ts|tsx)$',
  ],
  moduleFileExtensions: [
    'web.js',
    'js',
    'web.ts',
    'ts',
    'web.tsx',
    'tsx',
    'json',
    'web.jsx',
    'jsx',
    'node',
  ],
  resetMocks: true,
};

module.exports = config

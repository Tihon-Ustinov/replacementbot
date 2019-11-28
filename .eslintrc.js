module.exports = {
  'env': {
    'node': true,
    'commonjs': true,
    'es6': true,
  },
  'extends': [
    'google',
  ],
  'globals': {
    'Atomics': 'readonly',
    'SharedArrayBuffer': 'readonly',
  },
  'parserOptions': {
    'ecmaVersion': 2018,
  },
  'rules': {
    "new-cap": 0,
    "require-jsdoc": 0,
    'max-len': [2, 160, 4, {"ignoreUrls": true, "ignoreComments": true, "ignoreStrings": true, "ignoreRegExpLiterals": true}],
    "comma-dangle": ["error", "never"],
  },
};

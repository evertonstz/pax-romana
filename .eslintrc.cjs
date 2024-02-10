module.exports = {
  root: true,
  env: { browser: true, es2020: true },
  extends: [
    'eslint:recommended',
    'plugin:@typescript-eslint/recommended',
    'plugin:react-hooks/recommended',
  ],
  ignorePatterns: ['dist', '.eslintrc.cjs'],
  parser: '@typescript-eslint/parser',
  plugins: ['react-refresh', 'prettier'],
  extends: ['eslint:recommended', 'plugin:@typescript-eslint/recommended-type-checked', 
  'plugin:@typescript-eslint/stylistic-type-checked', 'plugin:prettier/recommended', 'plugin:react/recommended',
  'plugin:react-hooks/recommended', 'plugin:react/jsx-runtime'],
  parserOptions: {
    ecmaVersion: 'latest',
    sourceType: 'module',
    project: ['./tsconfig.json', './tsconfig.node.json'],
    tsconfigRootDir: __dirname,
  },
  rules: {
    'react-refresh/only-export-components': [
      'warn',
      { allowConstantExport: true },
    ],
    'eqeqeq': 'error',
    'prettier/prettier': 'error',
    'max-len': ['error', 100],
    'no-console': 'error'
  },
}

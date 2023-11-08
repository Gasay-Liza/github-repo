module.exports = {
    env: {
      browser: true,
      es2021: true
    },
    
    extends: ['plugin:react/recommended', 'airbnb', 'airbnb-typescript', 'prettier'],
    parser: '@typescript-eslint/parser',
    overrides: [
      {
        files: ['*.ts', '*.tsx'],
        parserOptions: {
          project: ['./tsconfig.json']
        }
      }
    ],
    parserOptions: {
      ecmaFeatures: {
        jsx: true
      },
      ecmaVersion: 'latest',
      sourceType: 'module'
    },
    plugins: ['react', '@typescript-eslint', 'prettier'],
    rules: {
      '@typescript-eslint/no-shadow': 0,
      'consistent-return': 0,
      'import/prefer-default-export': 0,
      'react/jsx-props-no-spreading': 0,
      'react/require-default-props': 0,
      'react/button-has-type': 0,
      'react/no-unstable-nested-components': [2, { allowAsProps: true }],
      'react/no-array-index-key': 0,
      'class-methods-use-this': 0,
      'react/destructuring-assignment': 0,
      'no-param-reassign': ['error', {
        props: true,
        ignorePropertyModificationsFor: [
          'state',
        ]
      }],
    }
  };
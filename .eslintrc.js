module.exports = {
  plugins: ['@typescript-eslint'],
  rules: {
    'no-constant-condition': [0],
    'prettier/prettier': [
      'error',
      {
        trailingComma: 'all',
        semi: false,
        singleQuote: true,
        useTabs: false,
        jsxSingleQuote: false,
        bracketSpacing: true,
        arrowParens: 'always',
        quoteProps: 'consistent',
        proseWrap: 'always',
      },
    ],
  },
  extends: [
    'eslint:recommended',
    'plugin:prettier/recommended',
    'plugin:@typescript-eslint/recommended',
  ],
}

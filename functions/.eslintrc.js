// module.exports = {
//   root: true,
//   env: {
//     es6: true,
//     node: true
//   },
//   parser: '@typescript-eslint/parser',
//   parserOptions: {
//     project: ['./tsconfig.json'],
//     sourceType: 'module'
//   },
//   plugins: ['@typescript-eslint'],
//   extends: [
//     'eslint:recommended',
//     'plugin:@typescript-eslint/recommended'
//   ],
//   rules: {
//     'semi': ['error', 'always'], // Enforce semicolon usage
//     'quotes': ['error', 'double'], // Enforce double quotes
//     'no-unused-vars': 'off', // Disable the base rule as it can report incorrect errors
//     '@typescript-eslint/no-unused-vars': ['error'] // Enable the TypeScript-specific rule
//   }
// };
module.exports = {
  root: true,
  env: {
    es6: true,
    node: true,
  },
  extends: [
    "eslint:recommended",
    "plugin:import/errors",
    "plugin:import/warnings",
    "plugin:import/typescript",
    "google",
    "plugin:@typescript-eslint/recommended",
  ],
  parser: "@typescript-eslint/parser",
  parserOptions: {
    project: ["tsconfig.json", "tsconfig.dev.json"],
    sourceType: "module",
  },
  ignorePatterns: [
    "/lib/**/*", // Ignore built files.
    "/generated/**/*", // Ignore generated files.
  ],
  plugins: [
    "@typescript-eslint",
    "import",
  ],
  rules: {
    "quotes": ["error", "double"],
    "import/no-unresolved": 0,
    "indent": ["error", 2],
  },
};

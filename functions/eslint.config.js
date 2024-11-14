module.exports = [
  {
    ignores: ["lib/**/*"], // Ignore built files
  },
  {
    files: ["**/*.ts"],
    languageOptions: {
      ecmaVersion: 2021,
      sourceType: "module",
      parser: require("@typescript-eslint/parser"),
      parserOptions: {
        project: "./tsconfig.json",
      },
    },
    plugins: {
      "@typescript-eslint": require("@typescript-eslint/eslint-plugin"),
    },
    rules: {
      "semi": ["error", "never"], // Enforce semicolon usage at the end of statements
      "quotes": ["error", "double"], // Enforce double quotes for strings
      "no-unused-vars": "off", // Disable the base rule as it can report incorrect errors
      "@typescript-eslint/no-unused-vars": ["error"], // Enable TypeScript-specific rule
    },
  },
];

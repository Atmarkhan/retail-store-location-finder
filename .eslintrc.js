module.exports = {
  parser: "@typescript-eslint/parser",
  parserOptions: {
    ecmaVersion: 2020,
    sourceType: "module",
  },
  plugins: ["@typescript-eslint"],
  rules: {
    "@typescript-eslint/no-unused-vars": ["error", { argsIgnorePattern: "^_" }],
    "@typescript-eslint/no-explicit-any": "warn",
    "no-console": "off",
    "no-unused-vars": "off", // Turn off base rule as it can report incorrect errors
  },
  env: {
    node: true,
    jest: true,
    es6: true,
  },
  ignorePatterns: ["dist/", "node_modules/", "*.js"],
};

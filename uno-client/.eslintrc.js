module.exports = {
  parser: "@babel/eslint-parser",
  parserOptions: {
    ecmaVersion: 2020, // Enable modern ECMAScript features
    sourceType: "module",
    requireConfigFile: false,
  },
  env: {
    browser: true,
    es6: true,
  },
  extends: [
    "plugin:vue/vue3-recommended", // Enable Vue linting
    "eslint:recommended",
  ],
  rules: {
    // Add custom rules if needed
  },
};

module.exports = {
    "plugins": ["es"],
    env: {
        browser: true,
        commonjs: true,
        es2021: true,
        node: true,
    },
    extends: "eslint:recommended",
    overrides: [],
    parserOptions: {
        ecmaVersion: "latest",
    // ecmaVersion: 5,
    },
    ignorePatterns: ["node_modules", "**/*.OLD.js", "archivos-referencia"],
    rules: {
        "no-shadow": "error",
        "multiline-ternary": ["error", "never"],
        "max-len": ["error", 2000],
        // "no-magic-numbers": ["warn", { "ignore": [0], "ignoreArrayIndexes": true }],
        "no-var": "warn",
        "no-self-compare": "error",
        // "es/no-template-literals": "warn",
        "no-unused-vars": [
            "off",
            { args: "all", argsIgnorePattern: "^_", varsIgnorePattern: "^_" },
        ],
        "no-multiple-empty-lines": ["error", { "max": 2, }],
        "prefer-const": ["error", {
            "destructuring": "any",
            "ignoreReadBeforeAssign": false
        }],
        "no-extend-native": "warn",
        "no-use-before-define": ["error", {
            "functions": false,
            "classes": true,
            "variables": true,
            "allowNamedExports": false
        }],
        "block-scoped-var": "warn",
        "no-bitwise": "error",
        indent: ["error", 4, { "SwitchCase": 1 }],
        "no-mixed-operators": "warn",
        "no-new-object": 1,
        "linebreak-style": ["error", "windows"],
        quotes: ["error", "double"],
        semi: ["error", "always"],
    },
};

module.exports = {
    parser: "@typescript-eslint/parser",
    extends: ["plugin:@typescript-eslint/recommended", "react-app", "plugin:prettier/recommended"],
    plugins: ["@typescript-eslint", "react", "simple-import-sort"],
    rules: {
        "@typescript-eslint/no-explicit-any": "error",
        "simple-import-sort/sort": "warn",
    },
};

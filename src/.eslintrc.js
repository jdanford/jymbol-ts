module.exports = {
    parser: "@typescript-eslint/parser",
    extends: ["plugin:@typescript-eslint/recommended", "plugin:prettier/recommended"],
    plugins: ["@typescript-eslint", "simple-import-sort"],
    rules: {
        "@typescript-eslint/no-explicit-any": "error",
        "@typescript-eslint/ban-types": [
            "error",
            {
                types: {
                    Symbol: false,
                },
                extendDefaults: true,
            },
        ],
    },
};

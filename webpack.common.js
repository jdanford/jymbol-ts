const path = require("path");

const { CleanWebpackPlugin } = require("clean-webpack-plugin");
const HtmlWebpackPlugin = require("html-webpack-plugin");

const imageLoader = {
    loader: "url-loader",
    options: {
        name: "static/images/[name].[hash:8].[ext]",
        limit: 8192,
    },
};

const fontLoader = {
    loader: "file-loader",
    options: {
        name: "static/fonts/[name].[hash:8].[ext]",
    },
};

module.exports = {
    entry: path.resolve("./src/index.ts"),
    module: {
        rules: [
            {
                test: /\.tsx?$/,
                exclude: /node_modules/,
                use: {
                    loader: "ts-loader",
                    options: {
                        compilerOptions: { incremental: true, tsBuildInfoFile: ".tsbuild" },
                    },
                },
            },
        ],
    },
    resolve: {
        extensions: [".tsx", ".ts", ".js"],
    },
    plugins: [
        new CleanWebpackPlugin(),
        new HtmlWebpackPlugin({
            title: "jymbol",
            showErrors: false,
        }),
    ],
    output: {
        filename: "static/[name].[chunkhash:8].js",
        path: path.resolve("./dist"),
        publicPath: "/",
    },
};

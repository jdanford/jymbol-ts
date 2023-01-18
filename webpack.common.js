const path = require("path");

// const { DefinePlugin } = require("webpack");
const { CleanWebpackPlugin } = require("clean-webpack-plugin");
// const CopyWebpackPlugin = require("copy-webpack-plugin");
// const FaviconsWebpackPlugin = require("favicons-webpack-plugin");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
// const ScriptExtHtmlWebpackPlugin = require("script-ext-html-webpack-plugin");
// const WebpackPwaManifest = require("webpack-pwa-manifest");

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
                test: /\.scss$/,
                use: [
                    MiniCssExtractPlugin.loader,
                    "css-loader",
                    {
                        loader: "postcss-loader",
                        options: { plugins: () => [require("autoprefixer")] },
                    },
                    "sass-loader",
                ],
            },
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
            {
                test: /\.(jp(e)?g|png)$/,
                use: [imageLoader],
            },
            {
                test: /\.svg$/,
                include: /media/,
                use: [imageLoader],
            },
            {
                test: /\.(woff(2)?|ttf|eot)$/,
                use: [fontLoader],
            },
            {
                test: /\.svg$/,
                exclude: /media/,
                use: [fontLoader],
            },
        ],
    },
    resolve: {
        extensions: [".tsx", ".ts", ".js"],
    },
    plugins: [
        new CleanWebpackPlugin(),
        // new DefinePlugin({
        //     COMANAGE_API_URL: JSON.stringify(COMANAGE_API_URL),
        //     INTERCOM_APP_ID: JSON.stringify(INTERCOM_APP_ID),
        //     PLAID_ENV: JSON.stringify(PLAID_ENV),
        // }),
        new HtmlWebpackPlugin({
            title: "jymbol",
            showErrors: false,
        }),
        // new ScriptExtHtmlWebpackPlugin({
        //     defaultAttribute: "defer",
        // }),
        // new MiniCssExtractPlugin({
        //     filename: "static/[name].[contenthash:8].css",
        //     chunkFilename: "static/[id].[contenthash:8].css",
        // }),
        // new FaviconsWebpackPlugin({
        //     prefix: "static/icons/[hash:8]/",
        //     logo: path.resolve(appConfig.iconPath),
        //     icons: {
        //         android: false,
        //         appleIcon: false,
        //         appleStartup: false,
        //         favicons: true,
        //         firefox: false,
        //     },
        // }),
        // new WebpackPwaManifest({
        //     filename: "manifest.json",
        //     name: appConfig.title,
        //     short_name: appConfig.title,
        //     description: appConfig.description,
        //     background_color: appConfig.colors.background,
        //     theme_color: appConfig.colors.theme,
        //     icons: {
        //         src: path.resolve(appConfig.iconPath),
        //         destination: "static/icons",
        //         sizes: [96, 128, 192],
        //     },
        // }),
        // new CopyWebpackPlugin({
        //     patterns: [{ from: "???" }],
        // }),
    ],
    output: {
        filename: "static/[name].[chunkhash:8].js",
        path: path.resolve("./dist"),
        publicPath: "/",
    },
};

const path = require('path');
const htmlWebpackPlugin = require('html-webpack-plugin');
const HardSourceWebpackPlugin = require('hard-source-webpack-plugin');
var webpack = require('webpack');
var dotenv = require('dotenv');

module.exports = () => {
    const env = dotenv.config({debug: true, path: '.env.development'}).parsed;
    const envKeys = Object.keys(env).reduce((prev, next) => {
        prev[`process.env.${next}`] = JSON.stringify(env[next]);
        return prev;
    }, {});
    console.log(envKeys);

    return {
        mode: 'development',
        entry: './app/src/index.tsx',
        output: {
            path: path.resolve(__dirname, 'dist'),
            filename: "index.js",
            chunkFilename: "[name].js",
        },
        devServer: {
            historyApiFallback: true,
            contentBase: 'dist',
            port: 9090,
            inline: true,
            hot: true
        },
        module: {
            rules: [
                {
                    loader: 'ts-loader',
                    test: /\.tsx?$/,
                    exclude: [
                        /node_modules/
                    ],
                    options: {
                        configFile: 'tsconfig.json'
                    }
                },
                {
                    test: /\.(png|jpg|gif)$/,
                    loader: 'url-loader',
                    options: {
                        name: '[name].[ext]'
                    }
                },
                {
                    enforce: 'pre',
                    test: /\.tsx?$/,
                    exclude: [
                        /node_modules/
                    ],
                    use: [
                        {
                            loader: 'tslint-loader',
                            // trueにするとhotloadが遅くなるのでfalse
                            options: {
                                typeCheck: false,
                                fix: false
                            },
                        },
                    ]
                },
                {
                    test: /\.css/,
                    use: [
                        "style-loader",
                        {
                            loader: "css-loader",
                            options: { url: false }
                        }
                    ]
                },
                {
                    test: /\.json$/,
                    loader: 'json-loader',
                    type: 'javascript/auto'
                }
            ]
        },
        resolve: {
            extensions: [ '.tsx', '.ts', '.js' ]
        },
        plugins: [
            new htmlWebpackPlugin({
                template: "./app/src/index.html"
            }),
            new HardSourceWebpackPlugin(),
            new webpack.DefinePlugin(envKeys)
        ]
    };

};

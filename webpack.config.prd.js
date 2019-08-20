const path = require('path');
const htmlWebpackPlugin = require('html-webpack-plugin');
var webpack = require('webpack');
var dotenv = require('dotenv');

module.exports = () => {
    console.log(process.env.NODE_ENV);
    const env = dotenv.config({debug: true, path: '.env.production'}).parsed;
    // console.log(env);
    // reduce it to a nice object, the same as before
    const envKeys = Object.keys(env).reduce((prev, next) => {
        prev[`process.env.${next}`] = JSON.stringify(env[next]);
        return prev;
    }, {});

    return {
        mode: 'production',
        entry: './app/src/index.tsx', //このwebpackはcontainerの/app/webpack.config.jsにマウントされる
        output: {
            path: path.resolve(__dirname, './app/dist'),
            filename: "index.[chunkhash:10].js",
            chunkFilename: "[name].js",
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
                    test: /\.css/,
                    use: [
                        "style-loader",
                        {
                            loader: "css-loader",
                            options: {url: false}
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
            extensions: ['.tsx', '.ts', '.js']
        },
        plugins: [
            new htmlWebpackPlugin({
                template: "./app/src/index.html"
            }),
            new webpack.DefinePlugin(envKeys)
        ]
    };
}